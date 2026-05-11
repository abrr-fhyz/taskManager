from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.tasks import router as task_router
import uvicorn

app = FastAPI(title="Task-Manager API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(task_router)

@app.get("/")
def root():
    return {"message": "Task-Manager API is online."}

#if __name__ == "__main__":
#    uvicorn.run(
#        "app:app",
#        host="localhost",
#        port=8000,
#        reload=True 
#    )