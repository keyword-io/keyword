# Keyword

## Developer guide

This guide helps you get started developing Keyword.

### Dependencies

Make sure you have the following dependencies installed before setting up your developer environment:

- [Git](https://git-scm.com/)
- [Node.js `v20.x`](https://nodejs.org/dist/v20.10.0/)
- [Pnpm](https://pnpm.io)
- [docker & docker compose](https://www.docker.com/get-started/)

#### Build Keyword

At the first, you may need to install `pnpm` globally:

```shell
npm install -g pnpm
```

At the second, you need to install the dependencies:

```shell
pnpm install
```

Next, bootstrap workspace:

```shell
pnpm turbo run prepublish
```

After bootstrap, you need to make sure docker is installed. If docker is installed, run container:

```shell
# first you should goto server package
cd package/server
# then up docker
pnpm docker-compose:up

# if you need stop development container, you should down them
pnpm docker-compose:down
```

Whenever you update a submodule, ensure to execute the command:

```shell
# eg: in utils module
pnpm build
# or
pnpm prepublish
```

##### Frontend

You need to goto ui module, and execute command:

```shell
pnpm dev
```

UI dev server will running at `http://localhost:3000`.

Before your official involvement in code development, it is necessary for you to acquire the following knowledge:

1. You need to use [tailwind](https://tailwindcss.com) css to set class. If you need to custom css, you should use [linaria](https://linaria.dev).
2. The ui component library is [shadcn-ui](https://ui.shadcn.com). It is imperative that you strictly utilize this UI library to obtain components with a consistent style.
3. You need to grasp [GraphQL](https://graphql.org/learn/) as soon as possible, as it is the sole interface specification, and the backend is also implemented based on GraphQL.

##### Backend

You need to goto server module, make sure postgres sql is running, and execute command:

```shell
pnpm start:emit
```

Server will run at `http://localhost:4000`.

Before your official involvement in code development, it is necessary for you to acquire the following knowledge:

1. The ORM application being used is [Prisma](https://www.prisma.io). It is imperative for you to swiftly acquaint and master it, as the database tables are constructed using Prisma.
2. The server is implemented based on [Apollo Server](https://www.apollographql.com/docs/apollo-server).
3. After declaring the types in the corresponding schema submodule, the interface schema is utilized in the server.
