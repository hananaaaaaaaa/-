import sqlite3

class DatabaseManager:
    def __init__(self, db_path='../data/douban_top100.db'):
        self.db_path = db_path

    def get_rating_distribution(self):
        """获取评分分布"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('SELECT rating, COUNT(*) as count FROM movies GROUP BY rating ORDER BY rating')
        data = [{'rating': row[0], 'count': row[1]} for row in cursor.fetchall()]
        conn.close()
        return data

    # 其他数据方法保持不变...
