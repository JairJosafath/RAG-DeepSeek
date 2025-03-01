# 04 add vector database

## New Features Added with Cursor AI
This branch introduces several new features developed with the assistance of Cursor AI:

1. **Enhanced Model Settings**
   - Dynamic temperature control
   - Adjustable top-p and top-k parameters
   - Configurable token generation limits
   - Presence and frequency penalty controls

2. **Improved Document Management**
   - PDF file upload with drag-and-drop support
   - Document context awareness in chat
   - Real-time upload status feedback
   - Error handling for file operations

3. **Advanced Chat Interface**
   - Streaming responses with loading indicators
   - Dark/Light mode support
   - Context-aware responses based on selected documents
   - Model selection with embedding model filtering

4. **Backend Improvements**
   - Vector store integration with ChromaDB
   - Proper parameter handling for LLM requests
   - Streaming response support
   - Document embedding with nomic-embed-text

## Running & Testing the application
### 1. Run the docker-compose file
```bash
docker-compose up 
```
you can also use flags such as `--build` to rebuild the images, `-d` to run in detached mode, and `--force-recreate` to recreate the containers. Pick and choose the flags as needed.

```bash
docker-compose up --build -d --force-recreate
```

### 2. Open your browser, go to `http://localhost/`. The title should say Deepseeker-04.

### 3. Pull embedding model
To fill our vector database, we need to pull the embedding model. To do this, open a terminal and run the following command:
```bash
docker exec rag-deepseek-ollama-1 ollama pull nomic-embed-text
```

### 4. Upload a document and ask a question to test the application.

## Learning Resources

### Cursor AI
- [Cursor Official Website](https://cursor.sh/)
- [Cursor GitHub](https://github.com/getcursor/cursor)

### Related Technologies
- [ChromaDB Documentation](https://docs.trychroma.com/)
- [Ollama](https://ollama.ai/)
- [React TypeScript Best Practices](https://react-typescript-cheatsheet.netlify.app/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
