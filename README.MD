# RAG-DeepSeek


<span style="color:#9AC7D5" >RAG-DeepSeek</span> is a proof-of-concept application that demonstrates the integration of Retrieval-Augmented Generation (RAG) using a local DeepSeek model with Ollama. This project showcases how to combine document retrieval with large language models to provide accurate and contextually relevant responses.

<div align="center">
  <img src="img/arch.png" width="80%" alt="DeepSeek-V3" />
</div>

<div align="center">
  <img src="img/app.png" width="80%" alt="DeepSeek-V3" />
</div>

## Features

- **Document Ingestion**: Supports multiple document formats (e.g., PDF) for building a knowledge base.
- **Intelligent Retrieval**: Utilizes vector databases to store and retrieve document embeddings efficiently.
- **Local LLM Support**: Runs entirely on your machine using Ollama, ensuring data privacy and offline capabilities.
- **DeepSeek Model**: Uses an open-source DeepSeek model available through Ollama for high-quality text generation.

## Build the project gradually

The steps to build this project are organized in the branches. Each branch represents a step in the project development. The following branches are available:
- 01-setup
- 02-add-ollama
- 03-add-frontend-api
- 04-add-vector-database
- main