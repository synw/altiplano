# Altiplano

Tooling to work with language models. The Altiplano is the place where the llamas live

## Inference server

An inference server in Go to run local language models: [Goinfer](https://github.com/synw/altiplano/tree/main/goinfer)

## Typescript Packages

| Version | Name | Description |
| --- | --- | --- |
| [![pub package](https://img.shields.io/npm/v/@altiplano/types)](https://www.npmjs.com/package/@altiplano/types) | [@altiplano/types](https://github.com/synw/altiplano/tree/main/packages/types) | The shared data structures |
| [![pub package](https://img.shields.io/npm/v/@altiplano/usellama)](https://www.npmjs.com/package/@altiplano/usellama) | [@altiplano/usellama](https://github.com/synw/altiplano/tree/main/packages/usellama) | A composable to use Llama.cpp |
| [![pub package](https://img.shields.io/npm/v/@altiplano/inferserver)](https://www.npmjs.com/package/@altiplano/inferserver) | [@altiplano/inferserver](https://github.com/synw/altiplano/tree/main/packages/inferserver) | An inference server library |
| [![pub package](https://img.shields.io/npm/v/@altiplano/taskserver)](https://www.npmjs.com/package/@altiplano/taskserver) | [@altiplano/taskserver](https://github.com/synw/altiplano/tree/main/packages/taskserver) | A tasks server library |

Note: these packages are built on top of [Llama-node](https://github.com/Atome-FE/llama-node). As it does not seem to be maintained anymore the Typescript packages development is currently paused and might be reoriented
