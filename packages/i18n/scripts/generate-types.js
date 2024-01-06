const path = require('path');
const fs = require('fs');
const { camelCase, snakeCase, constantCase } = require('change-case');
const i18nextPath = require.resolve('i18next');
const i18nextDeclarePath = path.resolve(i18nextPath, '../../../index.d.ts');
const i18nextDeclareContent = fs.readFileSync(i18nextDeclarePath, 'utf-8');
const { format } = require('prettier');
const { get, set } = require('lodash');

const CN_LOCALE_DIR_PATH = path.resolve(__dirname, '../src/locales/zh-CN');
const GENERATED_DIR_PATH = path.resolve(
  __dirname,
  '../src/generated/declerations'
);
const I18N_DECLARATION_FILE_PATH = path.join(
  GENERATED_DIR_PATH,
  'i18next.d.ts'
);
const PRETTIER_CONFIG_PATH = path.resolve(__dirname, '../../../.prettierrc');
const prettierConfig = JSON.parse(
  fs.readFileSync(PRETTIER_CONFIG_PATH, 'utf-8')
);
const PARAMS_REGEXP = /\.*\{\s*(\w+)\s*}\.*/gm;

function getI18nKeys(filepath) {
  delete require.cache[filepath];
  const fileContent = require(filepath);
  const keys = Object.keys(fileContent);

  const result = [];

  for (const key of keys) {
    const obj = {
      key,
      params: [],
    };
    const text = fileContent[key];
    const params = text.match(PARAMS_REGEXP);
    if (Array.isArray(params)) {
      obj.params = params.map(param => param.replace(/[{}]/g, '').trim());
    }
    result.push(obj);
  }

  return result;
}

function generateNamespaceKeysText(namespace, keysMap) {
  return `type ${namespace}Keys = ${keysMap
    .map(item => `'${item.key}'`)
    .join('|')};`;
}

function generateParamsKeysText(list) {
  const paramsMap = {};

  for (const obj of list) {
    for (const item of obj.keysMap) {
      if (!item.params.length) {
        continue;
      }
      const paramsKey = item.params.sort().join(',');
      const keysMap = get(paramsMap, [paramsKey, obj.namespace]);
      if (keysMap) {
        keysMap.add(item.key);
        set(paramsMap, [paramsKey, obj.namespace], keysMap);
      } else {
        set(paramsMap, [paramsKey, obj.namespace], new Set([item.key]));
      }
    }
  }

  const texts = [];
  const namespaceParamsKeysTexts = [];

  Object.entries(paramsMap).forEach(([paramsKeys, namespaceMap]) => {
    const typeTexts = [];
    const keyTexts = [];
    const paramsKeysText = snakeCase(paramsKeys, { delimiter: '__' });
    Object.entries(namespaceMap).forEach(([namespace, keys]) => {
      const keyText = `Params_${constantCase(
        namespace
      )}_${paramsKeysText}_Keys`;
      typeTexts.push(
        `type ${keyText} = \`${namespace}.\${${Array.from(keys)
          .map(key => `'${key}'`)
          .join('|')}}\``
      );
      keyTexts.push(keyText);
    });

    const namespaceParamsKeysText = `Params_${paramsKeysText}_Keys`;
    texts.push(
      ...typeTexts,
      `type ${namespaceParamsKeysText} = ${keyTexts.join('|')}`
    );
    namespaceParamsKeysTexts.push({
      key: namespaceParamsKeysText,
      params: paramsKeys.split(','),
    });
  });

  return {
    text: texts.join('\n'),
    namespaceParamsKeysTexts,
  };
}

function generateTOptionsMapText(paramsKeys) {
  const paramsKeysTypeText = paramsKeys
    .map(item => {
      const { key, params } = item;
      const paramsText = params
        .map(param => `${param}: string | number | undefined | null;`)
        .join('');
      return `{[index in ${key}]: TOptions<{ ${paramsText} }> | string; }`;
    })
    .join(' & ');
  return `type TOptionsMap = { [index in AllNamespaceKeys]: TOptionsBase } & ${paramsKeysTypeText};`;
}

function generateAllNamespaceKeysText(namespaceKeys) {
  const allNamespaceKeys = namespaceKeys
    .map(item => {
      const { namespace } = item;
      return `\`${namespace}.\${${namespace}Keys}\``;
    })
    .join('|');
  return `
    ${namespaceKeys.map(item => item.keysText).join('\n    ')}
    type AllNamespaceKeys = ${allNamespaceKeys}
  `;
}

function generateNamespaceText(namespaces) {
  return `export type Namespaces = ${namespaces
    .map(namespace => `'${namespace}'`)
    .join('|')}`;
}

function generateTFunctionText(
  allNamespaceKeysText,
  paramsKeysText,
  tOptionMapText,
  namespaceText
) {
  return `
    ${allNamespaceKeysText}
    ${paramsKeysText}

    ${tOptionMapText}

    export type TFunction = {
      <T extends AllNamespaceKeys>(key: T, options?: TOptionsMap[T]): string;
      <T extends AllNamespaceKeys>(
        key: AllNamespaceKeys,
        defaultValue: string,
        options?: TOptionsMap | string
      ): string;
      <T extends keyof TOptionsMap>(key: T, options: TOptionsMap[T]): string;
      <T extends keyof TOptionsMap>(
        key: T,
        defaultValue: string,
        options: TOptionsMap[T] | string
      ): string;
    };
    export type DynamicTFunction = {
      // basic usage
      <
        TResult = string,
        TKeys = string,
        TInterpolationMap extends object = StringMap
      >(
        key: TKeys | TKeys[],
        options?: TOptions<TInterpolationMap> | string,
      ): TResult;
      // overloaded usage
      <
        TResult = string,
        TKeys = string,
        TInterpolationMap extends object = StringMap
      >(
        key: TKeys | TKeys[],
        defaultValue?: string,
        options?: TOptions<TInterpolationMap> | string,
      ): TResult;
    }
    ${namespaceText}
  `;
}

function generateCustomTypeOptionsText(resourcesMap) {
  return `export interface CustomTypeOptions { resources: { ${Object.entries(
    resourcesMap
  )
    .map(([resource, keys]) => `${resource}: {${keys}}`)
    .join(';')} } }`;
}

async function generate() {
  const dirs = fs.readdirSync(CN_LOCALE_DIR_PATH);
  const allNamespaceKeys = [];
  const namespaces = [];
  const keysMaps = [];
  const resourcesMap = {};

  for (const dir of dirs) {
    const filepath = path.join(CN_LOCALE_DIR_PATH, dir);
    const state = fs.statSync(filepath);
    if (state.isFile() && dir.endsWith('.json')) {
      const keysMap = getI18nKeys(filepath);
      const namespace = camelCase(dir.replace(/\.json$/, ''));
      resourcesMap[namespace] = keysMap
        .map(item => `${item.key}:string;`)
        .join('');
      const namespaceKeysText = generateNamespaceKeysText(namespace, keysMap);
      keysMaps.push({ namespace, keysMap });
      namespaces.push(namespace);
      allNamespaceKeys.push({ namespace, keysText: namespaceKeysText });
    }
  }

  const allNamespaceKeysText = generateAllNamespaceKeysText(allNamespaceKeys);
  const { text: paramsKeysText, namespaceParamsKeysTexts } =
    generateParamsKeysText(keysMaps);
  const tOptionsMapText = generateTOptionsMapText(namespaceParamsKeysTexts);
  const namespacesText = generateNamespaceText(namespaces);
  const tFunctionText = generateTFunctionText(
    allNamespaceKeysText,
    paramsKeysText,
    tOptionsMapText,
    namespacesText
  );

  const startIndex = i18nextDeclareContent.indexOf('export type TFunction');
  const endIndex = i18nextDeclareContent.indexOf('export interface Resource');

  let outputText = i18nextDeclareContent
    .replace(
      i18nextDeclareContent.substring(startIndex, endIndex),
      tFunctionText
    )
    .replace(`count?: number;`, `count?: number | string;`);

  const i18nInterfaceText = 'export interface i18n {';
  const i18nInterfaceIndex = outputText.indexOf(i18nInterfaceText);
  outputText = outputText
    .replace(
      outputText.substr(i18nInterfaceIndex, i18nInterfaceText.length),
      [i18nInterfaceText, 'td: DynamicTFunction;'].join('\n')
    )
    .replace(
      'export interface CustomTypeOptions {}',
      generateCustomTypeOptionsText(resourcesMap)
    );

  if (!fs.existsSync(GENERATED_DIR_PATH)) {
    fs.mkdirSync(GENERATED_DIR_PATH, { recursive: true });
  }

  console.log(outputText);

  const typeDef = await format(
    [
      `/* eslint-disable */`,
      `declare module 'i18next' {`,
      outputText,
      `}`,
    ].join('\n'),
    {
      parser: 'typescript',
      ...prettierConfig,
    }
  );

  fs.writeFileSync(I18N_DECLARATION_FILE_PATH, typeDef);
}

generate().then(() => process.exit(0));
