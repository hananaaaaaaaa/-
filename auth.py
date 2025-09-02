import sqlite3
import bcrypt
import jwt
import datetime
import os

class AuthManager:
    def __init__(self, db_path='../data/users.db'):
        self.db_path = db_path
        self.secret_key = os.environ.get('SECRET_KEY', 'your-secret-key-here')
        self.init_database()
    
    def init_database(self):
        """初始化用户数据库"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username VARCHAR(50) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                email VARCHAR(100),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()
        conn.close()
    
    def register_user(self, username, password, email=None):
        """注册用户"""
        try:
            # 哈希密码
            password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO users (username, password_hash, email)
                VALUES (?, ?, ?)
            ''', (username, password_hash, email))
            
            conn.commit()
            user_id = cursor.lastrowid
            conn.close()
            
            return {'message': '注册成功', 'user_id': user_id}
        except sqlite3.IntegrityError:
            return {'error': '用户名已存在'}
        except Exception as e:
            return {'error': f'注册失败: {str(e)}'}
    
    def authenticate_user(self, username, password):
        """验证用户登录"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute('''
                SELECT id, username, password_hash, email FROM users WHERE username = ?
            ''', (username,))
            
            user = cursor.fetchone()
            conn.close()
            
            if not user:
                return {'error': '用户不存在'}
            
            user_id, username, password_hash, email = user
            
            # 验证密码
            if bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8')):
                # 生成JWT token
                token = self.generate_token(user_id)
                return {
                    'token': token,
                    'user': {
                        'id': user_id,
                        'username': username,
                        'email': email
                    }
                }
            else:
                return {'error': '密码错误'}
        except Exception as e:
            return {'error': f'登录失败: {str(e)}'}
    
    def generate_token(self, user_id):
        """生成JWT token"""
        payload = {
            'user_id': user_id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
        }
        return jwt.encode(payload, self.secret_key, algorithm='HS256')
    
    def verify_token(self, token):
        """验证JWT token"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=['HS256'])
            return payload['user_id']
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
    
    def get_user(self, user_id):
        """获取用户信息"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute('''
                SELECT id, username, email, created_at FROM users WHERE id = ?
            ''', (user_id,))
            
            user = cursor.fetchone()
            conn.close()
            
            if user:
                return {
                    'id': user[0],
                    'username': user[1],
                    'email': user[2],
                    'created_at': user[3]
                }
            return None
        except:
            return None
