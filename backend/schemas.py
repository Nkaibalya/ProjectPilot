from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from models import IssueStatus, IssuePriority

class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int
    created_by: int
    created_at: datetime

    class Config:
        from_attributes = True

class IssueBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[IssueStatus] = IssueStatus.OPEN
    priority: Optional[IssuePriority] = IssuePriority.MEDIUM
    project_id: int
    assigned_to: Optional[int] = None

class IssueCreate(IssueBase):
    pass

class IssueUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[IssueStatus] = None
    priority: Optional[IssuePriority] = None
    assigned_to: Optional[int] = None

class IssueResponse(IssueBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class CommentBase(BaseModel):
    message: str
    issue_id: int

class CommentCreate(CommentBase):
    pass

class CommentResponse(CommentBase):
    id: int
    user_id: int
    created_at: datetime
    user: UserResponse

    class Config:
        from_attributes = True

# Extended response models to include relationships if needed
class ProjectDetailResponse(ProjectResponse):
    issues: List[IssueResponse] = []

class IssueDetailResponse(IssueResponse):
    comments: List[CommentResponse] = []
    assignee: Optional[UserResponse] = None
