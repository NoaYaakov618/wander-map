"""Add image_filename to Journey model

Revision ID: 2231b0da7732
Revises: 
Create Date: 2024-08-22 09:02:32.716851

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2231b0da7732'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('journeys', schema=None) as batch_op:
        batch_op.add_column(sa.Column('image_filename', sa.String(length=255), nullable=True))
        batch_op.drop_column('updated_at')
        batch_op.drop_column('created_at')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('journeys', schema=None) as batch_op:
        batch_op.add_column(sa.Column('created_at', sa.DATETIME(), nullable=True))
        batch_op.add_column(sa.Column('updated_at', sa.DATETIME(), nullable=True))
        batch_op.drop_column('image_filename')

    # ### end Alembic commands ###
