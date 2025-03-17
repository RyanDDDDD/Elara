#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
测试 Flask API 的所有接口功能，并在所有测试通过后给出提示，
若有接口测试失败也会在最后提示出失败的测试项。

确保在运行此脚本前，Flask 服务器已经启动（例如：python app.py）。
需要安装 requests 库：pip install requests
"""

import requests
import urllib.parse

base_url = "http://127.0.0.1:5000"

def test_register():
    # 测试注册新用户
    user_data = {
        "username": "apitestuser",
        "password": "apitestpass",
        "email": "apitest@example.com"
    }
    response = requests.post(f"{base_url}/register", json=user_data)
    assert response.status_code == 201, f"注册失败: {response.text}"
    
    # 测试重复注册应返回错误
    response_dup = requests.post(f"{base_url}/register", json=user_data)
    assert response_dup.status_code != 201, "重复注册未返回错误状态码"

def test_login():
    # 测试正确登录
    login_data = {
        "username": "apitestuser",
        "password": "apitestpass"
    }
    response = requests.post(f"{base_url}/login", json=login_data)
    assert response.status_code == 200, f"登录失败: {response.text}"
    
    # 测试错误密码登录
    login_wrong = {
        "username": "apitestuser",
        "password": "wrongpass"
    }
    response_wrong = requests.post(f"{base_url}/login", json=login_wrong)
    assert response_wrong.status_code == 400, f"错误密码登录未返回400: {response_wrong.text}"

def test_get_and_update_user():
    # 测试获取用户信息
    response = requests.get(f"{base_url}/user/apitestuser")
    assert response.status_code == 200, f"获取用户信息失败: {response.text}"
    original_info = response.json()
    
    # 测试更新用户信息
    update_data = {
        "password": "newapitestpass",
        "email": "newapitest@example.com"
    }
    response_update = requests.post(f"{base_url}/user/apitestuser", json=update_data)
    assert response_update.status_code == 200, f"更新用户信息失败: {response_update.text}"
    
    # 再次获取用户信息验证更新结果
    response_after = requests.get(f"{base_url}/user/apitestuser")
    assert response_after.status_code == 200, f"获取更新后的用户信息失败: {response_after.text}"
    updated_info = response_after.json()
    assert updated_info["email"] == "newapitest@example.com", f"邮箱未更新: {updated_info}"

def test_conversation_api():
    # 测试创建新对话
    title = "Test Conversation"
    encoded_title = urllib.parse.quote(title)
    conversation_data = {
        "message": {"content": "Hello, this is a test message"}
    }
    response_conv = requests.post(f"{base_url}/user/apitestuser/history/new/{encoded_title}", json=conversation_data)
    assert response_conv.status_code == 201, f"创建对话失败: {response_conv.text}"
    conv_resp = response_conv.json()
    conversation_id = conv_resp.get("history_id")
    assert conversation_id, "没有返回 conversation_id"
    
    # 测试获取用户对话列表
    response_history = requests.get(f"{base_url}/user/apitestuser/history")
    assert response_history.status_code == 200, f"获取用户对话列表失败: {response_history.text}"
    
    # 测试获取对话详情
    response_detail = requests.get(f"{base_url}/history/{conversation_id}")
    assert response_detail.status_code == 200, f"获取对话详情失败: {response_detail.text}"
    
    # 测试向已有对话添加消息
    new_message_data = {
        "message": {"content": "Second test message"}
    }
    response_add = requests.post(f"{base_url}/user/apitestuser/history/{conversation_id}/{encoded_title}", json=new_message_data)
    assert response_add.status_code == 201, f"添加消息失败: {response_add.text}"
    
    # 验证消息是否追加成功
    response_detail_after = requests.get(f"{base_url}/history/{conversation_id}")
    assert response_detail_after.status_code == 200, f"获取对话详情失败: {response_detail_after.text}"
    messages = response_detail_after.json()
    assert messages[-1]["content"] == "Second test message", f"最新消息不匹配: {messages}"
    
    # 测试删除对话
    response_delete = requests.delete(f"{base_url}/history/{conversation_id}")
    assert response_delete.status_code == 200, f"删除对话失败: {response_delete.text}"
    
    # 验证删除后获取对话应返回 404
    response_detail_deleted = requests.get(f"{base_url}/history/{conversation_id}")
    assert response_detail_deleted.status_code == 404, f"删除后对话详情仍可获取: {response_detail_deleted.text}"

def run_test(test_name, test_function):
    try:
        test_function()
        print(f"[PASS] {test_name}")
        return True
    except AssertionError as e:
        print(f"[FAIL] {test_name}: {e}")
        return False
    except Exception as e:
        print(f"[FAIL] {test_name}: {e}")
        return False

if __name__ == "__main__":
    tests = [
        ("注册接口测试", test_register),
        ("登录接口测试", test_login),
        ("用户信息获取与更新测试", test_get_and_update_user),
        ("对话接口测试", test_conversation_api)
    ]
    
    failed_tests = []
    for name, func in tests:
        if not run_test(name, func):
            failed_tests.append(name)
    
    print("\n================ 测试结果 =================")
    if not failed_tests:
        print("所有测试全部通过！")
    else:
        print("以下测试未通过：")
        for t in failed_tests:
            print(" - " + t)
