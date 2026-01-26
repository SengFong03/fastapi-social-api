"""add last few columns to posts table

Revision ID: 2e6e1d741b07
Revises: eafc190240aa
Create Date: 2025-11-28 21:12:42.580931

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "2e6e1d741b07"
down_revision: Union[str, Sequence[str], None] = "eafc190240aa"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "posts",
        sa.Column("published", sa.Boolean(), nullable=False, server_default="TRUE"),
    )
    op.add_column(
        "posts",
        sa.Column(
            "created_at",
            sa.TIMESTAMP(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
    )
    pass


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("posts", "created_at")
    op.drop_column("posts", "published")
    pass
