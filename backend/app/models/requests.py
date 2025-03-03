from pydantic import BaseModel, Field


class UserLogin(BaseModel):
    username : str = Field(description="Username", examples=["foo"], max_length=50)
    password : str = Field(description="Password", examples=["bar"], max_length=50)

class TextQuery(BaseModel):
    text : str = Field(description="Written query", examples=["Quel temps fera-t-il à Tours demin ?", "Quel est la météo à Paris aujourd'hui ?"], max_length=50)
