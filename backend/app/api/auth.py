from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import APIRouter, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Depends

SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

router = APIRouter()

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# 👤 Usuário fake (depois vamos colocar banco real)
fake_user = {
    "email": "admin@ecotrack.com",
    "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$gZCScm5NaW3tnZPy3jsHYA$XG39v7BI1f8RRWCScAIalOreEttU6mbAJP9I025pJ5o"
}

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def authenticate_user(email: str, password: str):
    if email != fake_user["email"]:
        return False
    if not verify_password(password, fake_user["hashed_password"]):
        return False
    return {"email": email}

def create_access_token(data: dict):
    to_encode = data.copy()
    from datetime import datetime, timedelta, timezone

    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas"
        )
    
    access_token = create_access_token(data={"sub": user["email"]})
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }