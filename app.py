from flask import Flask, request, jsonify
from flask_cors import CORS
from auth import AuthManager
from database import DatabaseManager

app = Flask(__name__)
CORS(app)
auth = AuthManager()
db = DatabaseManager()

@app.route('/api/register', methods=['POST'])
def register():
    """用户注册"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    
    if not username or not password:
        return jsonify({'error': '用户名和密码不能为空'}), 400
    
    result = auth.register_user(username, password, email)
    if result.get('error'):
        return jsonify(result), 400
    
    return jsonify({'message': '注册成功'})

@app.route('/api/login', methods=['POST'])
def login():
    """用户登录"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': '用户名和密码不能为空'}), 400
    
    result = auth.authenticate_user(username, password)
    if result.get('error'):
        return jsonify(result), 401
    
    return jsonify({
        'message': '登录成功',
        'token': result['token'],
        'user': result['user']
    })

@app.route('/api/profile', methods=['GET'])
def get_profile():
    """获取用户信息"""
    token = request.headers.get('Authorization')
    if not token or not token.startswith('Bearer '):
        return jsonify({'error': '未提供token'}), 401
    
    user_id = auth.verify_token(token[7:])
    if not user_id:
        return jsonify({'error': 'token无效'}), 401
    
    user = auth.get_user(user_id)
    return jsonify({'user': user})

@app.route('/api/rating_distribution', methods=['GET'])
def get_rating_distribution():
    """需要登录的数据接口"""
    token = request.headers.get('Authorization')
    if not token or not token.startswith('Bearer '):
        return jsonify({'error': '请先登录'}), 401
    
    user_id = auth.verify_token(token[7:])
    if not user_id:
        return jsonify({'error': '请重新登录'}), 401
    
    data = db.get_rating_distribution()
    return jsonify(data)

# 其他数据接口同样需要添加登录验证...

if __name__ == '__main__':
    app.run(debug=True, port=5000)
