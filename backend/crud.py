from sqlalchemy.orm import Session
from passlib.context import CryptContext
from models import User, Project, Issue, Comment
from schemas import UserCreate, ProjectCreate, IssueCreate, IssueUpdate, CommentCreate
from typing import Optional

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# User Logic

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(email=user.email, name=user.name, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()

def delete_user(db: Session, user_id: int):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user

# Project Logic

def create_project(db: Session, project: ProjectCreate, user_id: int):
    db_project = Project(**project.dict(), created_by=user_id)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def get_projects(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Project).offset(skip).limit(limit).all()

def get_project(db: Session, project_id: int):
    return db.query(Project).filter(Project.id == project_id).first()

def delete_project(db: Session, project_id: int):
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if db_project:
        db.delete(db_project)
        db.commit()
    return db_project

# Issue Logic

def create_issue(db: Session, issue: IssueCreate):
    db_issue = Issue(**issue.dict())
    db.add(db_issue)
    db.commit()
    db.refresh(db_issue)
    return db_issue

def get_issues(db: Session, project_id: Optional[int] = None, skip: int = 0, limit: int = 100):
    query = db.query(Issue)
    if project_id:
        query = query.filter(Issue.project_id == project_id)
    return query.offset(skip).limit(limit).all()

def get_issue(db: Session, issue_id: int):
    return db.query(Issue).filter(Issue.id == issue_id).first()

def update_issue(db: Session, issue_id: int, issue_update: IssueUpdate):
    db_issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if db_issue:
        update_data = issue_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_issue, key, value)
        db.commit()
        db.refresh(db_issue)
    return db_issue

def delete_issue(db: Session, issue_id: int):
    db_issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if db_issue:
        db.delete(db_issue)
        db.commit()
    return db_issue

# Comment Logic

def create_comment(db: Session, comment: CommentCreate, user_id: int):
    db_comment = Comment(**comment.dict(), user_id=user_id)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

def get_comments(db: Session, issue_id: int, skip: int = 0, limit: int = 100):
    return db.query(Comment).filter(Comment.issue_id == issue_id).offset(skip).limit(limit).all()

def delete_comment(db: Session, comment_id: int):
    db_comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if db_comment:
        db.delete(db_comment)
        db.commit()
    return db_comment

def get_dashboard_stats(db: Session):
    total_projects = db.query(Project).count()
    total_issues = db.query(Issue).count()
    open_issues = db.query(Issue).filter(Issue.status == "OPEN").count()
    return {
        "total_projects": total_projects,
        "total_issues": total_issues,
        "open_issues": open_issues
    }
