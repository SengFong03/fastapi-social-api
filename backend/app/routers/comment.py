from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status, APIRouter, Response
from sqlalchemy.orm import Session
from .. import models, schemas, oauth2
from ..database import get_db
from sqlalchemy import func

router = APIRouter(
    prefix="/comments",  # remove duplication of /comments in each path
    tags=["Comments"],  # add tags for better documentation
)

@router.post(
    "/", status_code=status.HTTP_201_CREATED, response_model=schemas.CommentResponse
)
def create_comment(
    comment: schemas.CommentCreate,
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user),
):
    # Check if the post exists
    post = db.query(models.Post).filter(models.Post.id == comment.post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"post with id {comment.post_id} does not exist",
        )

    # Using SQLAlchemy ORM
    new_comment = models.Comment(
        **comment.model_dump(), user_id=current_user.id
    )  # Unpacking the comment data
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment