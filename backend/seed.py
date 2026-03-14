import models, database, crud
from schemas import UserCreate, ProjectCreate, IssueCreate, CommentCreate

models.Base.metadata.create_all(bind=database.engine)
db = database.SessionLocal()

# check if user already seeded
user_email = "kaibalya@gmail.com"
user = crud.get_user_by_email(db, email=user_email)

if not user:
    print("Creating demo user...")
    user_data = UserCreate(name="kaibalya", email=user_email, password="password")
    user = crud.create_user(db, user_data)
    print("User created!")

    print("Creating demo project...")
    project = db.query(models.Project).filter(models.Project.name == "Issue Tracker V2").first()
    if not project:
        project_data = ProjectCreate(name="Issue Tracker V2", description="A modern issue tracking system redesign")
        project = crud.create_project(db, project_data, user_id=user.id)
        print("Project created!")
    else:
        print("Project already exists.")

    print("Creating demo issues...")
    issue1 = crud.create_issue(db, IssueCreate(title="Set up database schemas", description="We need User, Project, Issue, and Comment models.", priority="HIGH", project_id=project.id, assigned_to=user.id))
    issue2 = crud.create_issue(db, IssueCreate(title="Build React UI", description="Use glassmorphism with dark theme.", priority="MEDIUM", project_id=project.id, assigned_to=user.id))
    issue3 = crud.create_issue(db, IssueCreate(title="Write Seed script", description="Create dummy data for testing", priority="LOW", status="DONE", project_id=project.id, assigned_to=user.id))
    print("Issues created!")

    print("Creating demo comments...")
    crud.create_comment(db, CommentCreate(message="Database looks good, models are complete.", issue_id=issue1.id), user_id=user.id)
    crud.create_comment(db, CommentCreate(message="Need to refine the Issue Detail page CSS.", issue_id=issue2.id), user_id=user.id)
    print("Comments created!")
else:
    print("Seed data already exists.")

db.close()
