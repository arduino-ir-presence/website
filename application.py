from flask import Flask, request
from flask_socketio import SocketIO
from config import dblogin

import mysql.connector
from mysql.connector import errorcode

app = Flask(__name__)
app.config['SECRET_KEY'] = 'asdf!'
socketio = SocketIO(app)

def try_db_login():
    try:
      global db_cnx
      db_cnx = mysql.connector.connect(**dblogin())

    except mysql.connector.Error as err:
      if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
        return "Something is wrong with your username or password"
      elif err.errno == errorcode.ER_BAD_DB_ERROR:
        return "Database does not exist"
      else:
        return str(err)

    else:
        return "DB connection successful"

def update_table():
    return 0

def query_rooms():
    cursor = db_cnx.cursor()
    query = ("SELECT `name`, `isOccupied` FROM `rooms`")
    cursor.execute(query)
    tuples = cursor.fetchall()
    cursor.close()
    return tuples

@app.route('/')
def hello_world():
    return app.send_static_file("index.html")

@app.route('/updateRoomStatus', methods=['POST'])
def upload_data():
    id = request.form.getlist('secretId')[0]
    occupied = request.form.getlist('isOccupied')[0]
    return '''Room ID: {} is currently occupied: {}\n'''.format(id, occupied)

@socketio.on('connect')
def connect():
    socketio.emit('initialData', query_rooms())

if __name__ == '__main__':
    socketio.run(app)
    print(try_db_login())
    app.debug = True
    try:
        app.run()
    finally:
        db_cnx.close()
