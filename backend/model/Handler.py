from supabase import create_client, Client
from dotenv import load_dotenv
from datetime import datetime
import os

load_dotenv()
url = os.getenv("URL")
key = os.getenv("API_KEY")
supabase: Client = create_client(url, key)
tableName = "Tasks"

def getAllTasks():
	response = supabase.table(tableName).select("*").execute()
	return response.data

def getTask(task_id):
	response = supabase.table(tableName).select("*").eq("task_id", task_id).execute()
	if response.data:
		return response.data[0]
	else:
		return None

def createTask(task_title, task_desc = None, due_at = None):
	data = {"task_title": task_title}
	if task_desc is not None:
		data["task_desc"] = task_desc
	if due_at is not None:
		if isinstance(due_at, datetime):
			due_at = due_at.isoformat()
		data["due_at"] = due_at
	response = supabase.table(tableName).insert(data).execute()
	if response.data:
		return response.data[0]
	else:
		return None

def updateTask(task_id, task_title = None, task_desc = None, due_at = None):
	data = {}
	if task_title is not None:
		data["task_title"] = task_title
	if task_desc is not None:
		data["task_desc"] = task_desc
	if due_at is not None:
		if isinstance(due_at, datetime):
			due_at = due_at.isoformat()
		data["due_at"] = due_at
	response = supabase.table(tableName).update(data).eq("task_id", task_id).execute()
	if response.data:
		return response.data[0]
	else:
		return None

def deleteTask(task_id):
	response = supabase.table(tableName).delete().eq("task_id", task_id).execute()
	if response.data:
		return response.data[0]
	else:
		return None

def toggleTask(task_id):
	thisTask = getTask(task_id)
	if not thisTask:
		return None
	newStatus = "A"
	if thisTask["task_status"] == "PENDING":
		newStatus = "COMPLETED"
	else:
		newStatus = "PENDING"
	response = supabase.table(tableName).update({"task_status": newStatus}).eq("task_id", task_id).execute()
	if response.data:
		return response.data[0]
	else:
		return None
