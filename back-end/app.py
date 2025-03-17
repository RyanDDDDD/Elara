from flask import Flask, request, jsonify, abort
import json
import uuid
import os.path
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# 用户数据库文件路径
USER_DB_PATH = "user_database.json"
# 历史对话数据库文件路径
HISTORY_DB_PATH = "conversation_history.json"

# 用户注册API
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    
    # 验证必要字段
    if not all([username, password, email]):
        abort(400, '用户名、密码和邮箱都是必填项!')
    
    # 读取用户数据库
    with open(USER_DB_PATH, 'r', encoding='utf-8') as f:
        users = json.load(f)
    
    # 检查用户名是否已存在
    if username in users:
        abort(400, '用户名已存在!')
    
    # 创建新用户
    users[username] = {
        "password": password,
        "email": email,
        "history_ids": [],
        "user_info": {"identity": "default"}  # 默认用户身份
    }
    
    # 保存用户数据库
    with open(USER_DB_PATH, 'w', encoding='utf-8') as f:
        json.dump(users, f, ensure_ascii=False, indent=4)
    
    return jsonify({"message": "注册成功"}), 201

# 用户登录API
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    # 验证必要字段
    if not all([username, password]):
        abort(400, '用户名和密码都是必填项!')
    
    # 读取用户数据库
    with open(USER_DB_PATH, 'r', encoding='utf-8') as f:
        users = json.load(f)
    
    # 检查用户名是否存在
    if username not in users:
        abort(400, '用户名不存在!')
    
    # 检查密码是否正确
    if users[username]["password"] != password:
        abort(400, '密码错误!')
    
    return jsonify({"message": "登录成功"}), 200

# 获取用户信息API
@app.route('/user/<username>', methods=['GET'])
def get_user_info(username):
    # 读取用户数据库
    with open(USER_DB_PATH, 'r', encoding='utf-8') as f:
        users = json.load(f)
    
    # 检查用户名是否存在
    if username not in users:
        abort(404, '用户名不存在!')
    
    # 返回用户信息（不包含密码）
    user_info = {
        "username": username,
        "password": "********",
        "email": users[username]["email"],
        "user_info": users[username]["user_info"]
    }
    
    return jsonify(user_info), 200

# 修改用户信息API
@app.route('/user/<username>', methods=['POST'])
def update_user_info(username):
    data = request.json
    new_password = data.get('password')
    new_email = data.get('email')
    
    # 读取用户数据库
    with open(USER_DB_PATH, 'r', encoding='utf-8') as f:
        users = json.load(f)
    
    # 检查用户名是否存在
    if username not in users:
        abort(404, '用户名不存在!')
    
    # 更新用户信息
    if new_password:
        users[username]["password"] = new_password
    
    if new_email:
        users[username]["email"] = new_email
    
    # 保存用户数据库
    with open(USER_DB_PATH, 'w', encoding='utf-8') as f:
        json.dump(users, f, ensure_ascii=False, indent=4)
    
    return jsonify({"message": "用户信息更新成功"}), 200

# 获取用户历史对话列表API - 只获取id和title
@app.route('/user/<username>/history', methods=['GET'])
def get_user_history(username):
    # 读取用户数据库
    with open(USER_DB_PATH, 'r', encoding='utf-8') as f:
        users = json.load(f)
    
    # 检查用户名是否存在
    if username not in users:
        abort(404, '用户名不存在!')
    
    # 读取历史对话数据库
    with open(HISTORY_DB_PATH, 'r', encoding='utf-8') as f:
        history_db = json.load(f)
    
    # 获取用户的历史对话ID列表
    history_ids = users[username]["history_ids"]
    
    # 获取历史对话id和title
    history_list = []
    for history_id in history_ids:
        if history_id in history_db:
            history_list.append({
                "id": history_id,
                "title": history_db[history_id].get("title", "无标题对话")
            })
    
    return jsonify({"history": history_list}), 200

# 获取特定历史对话详情API
@app.route('/history/<history_id>', methods=['GET'])
def get_history_detail(history_id):
    # 读取历史对话数据库
    with open(HISTORY_DB_PATH, 'r', encoding='utf-8') as f:
        history_db = json.load(f)
    
    # 检查历史对话ID是否存在
    if history_id not in history_db:
        abort(404, '不存在对话:' + history_id)
    
    return jsonify(history_db[history_id]["messages"]), 200

# 保存对话API - 合并创建新对话和添加消息功能
@app.route('/user/<username>/history/<history_id>/<title>', methods=['POST'])
def save_conversation(username, history_id, title):
    data = request.json
    message = data.get('message')
    
    if not message:
        abort(400, '消息内容不能为空!')
    
    # 读取用户数据库
    with open(USER_DB_PATH, 'r', encoding='utf-8') as f:
        users = json.load(f)
    
    # 检查用户名是否存在
    if username not in users:
        abort(404, '用户名不存在!')
    
    # 读取历史对话数据库
    with open(HISTORY_DB_PATH, 'r', encoding='utf-8') as f:
        history_db = json.load(f)
    
    # 检查历史对话ID是否存在，不存在则创建新对话
    is_new_conversation = False
    if history_id == "new" or history_id not in history_db:
        is_new_conversation = True
        history_id = str(uuid.uuid4())
        history_db[history_id] = {
            "title": title,
            "messages": []
        }
        # 更新用户的历史对话ID列表
        if history_id not in users[username]["history_ids"]:
            users[username]["history_ids"].append(history_id)
    
    # 添加消息
    history_db[history_id]["messages"].append(message)
    
    # 保存历史对话数据库
    with open(HISTORY_DB_PATH, 'w', encoding='utf-8') as f:
        json.dump(history_db, f, ensure_ascii=False, indent=4)
    
    # 保存用户数据库（如果创建了新对话）
    if is_new_conversation:
        with open(USER_DB_PATH, 'w', encoding='utf-8') as f:
            json.dump(users, f, ensure_ascii=False, indent=4)
    
    return jsonify({
        "message": "对话保存成功",
        "history_id": history_id,
        "is_new": is_new_conversation
    }), 201

# 删除历史对话API
@app.route('/history/<history_id>', methods=['DELETE'])
def delete_history(history_id):
    # 读取历史对话数据库
    with open(HISTORY_DB_PATH, 'r', encoding='utf-8') as f:
        history_db = json.load(f)
    
    # 检查历史对话ID是否存在
    if history_id not in history_db:
        abort(404, '历史对话不存在!')
    
    # 读取用户数据库
    with open(USER_DB_PATH, 'r', encoding='utf-8') as f:
        users = json.load(f)
    
    # 从所有用户的历史对话ID列表中删除该ID
    for username, user_data in users.items():
        if history_id in user_data["history_ids"]:
            user_data["history_ids"].remove(history_id)
    
    # 从历史对话数据库中删除该对话
    del history_db[history_id]
    
    # 保存历史对话数据库
    with open(HISTORY_DB_PATH, 'w', encoding='utf-8') as f:
        json.dump(history_db, f, ensure_ascii=False, indent=4)
    
    # 保存用户数据库
    with open(USER_DB_PATH, 'w', encoding='utf-8') as f:
        json.dump(users, f, ensure_ascii=False, indent=4)
    
    return jsonify({"message": "历史对话删除成功"}), 200

if __name__ == '__main__':
    app.run(debug=True)