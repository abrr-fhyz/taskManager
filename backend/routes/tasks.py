from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import model.Handler as Handler

router = APIRouter(prefix="/api/tasks", tags=["tasks"])

class TaskCreate(BaseModel):
    task_title: str
    task_desc: Optional[str] = None
    due_at: Optional[datetime] = None

class TaskUpdate(BaseModel):
    task_title: Optional[str] = None
    task_desc: Optional[str] = None
    due_at: Optional[datetime] = None

@router.get("")
def get_all_tasks():
    return Handler.getAllTasks()

@router.post("", status_code=201)
def create_task(body: TaskCreate):
    if not body.task_title.strip():
        raise HTTPException(status_code=400, detail="Please Enter Title.")
    task = Handler.createTask(body.task_title.strip(), body.task_desc, body.due_at)
    if not task:
        raise HTTPException(status_code=500, detail="Failed to create task.")
    return task

@router.put("/{task_id}")
def update_task(task_id: str, body: TaskUpdate):
    if body.task_title is not None and not body.task_title.strip():
        raise HTTPException(status_code=400, detail="Title cannot be empty.")
    existing = Handler.getTask(task_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Task not found.")
    task = Handler.updateTask(task_id, body.task_title, body.task_desc, body.due_at)
    return task

@router.patch("/{task_id}/toggle")
def toggle_task(task_id: str):
    task = Handler.toggleTask(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")
    return task

@router.delete("/{task_id}", status_code=200)
def delete_task(task_id: str):
    existing = Handler.getTask(task_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Task not found.")
    Handler.deleteTask(task_id)
    return {"message": "Task deleted."}