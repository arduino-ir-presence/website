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
      cnx = mysql.connector.connect(**dblogin())
      cnx.close()
      return "Hello World! Success"

    except mysql.connector.Error as err:
      if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
        return "Something is wrong with your username or password"
      elif err.errno == errorcode.ER_BAD_DB_ERROR:
        return "Database does not exist"
      else:
        return str(err)

@app.route('/')
def hello_world():
    return app.send_static_file("index.html")

@app.route('/updateRoomStatus', methods=['POST'])
def upload_data():
    id = request.form.getlist('secretID')[0]
    occupied = request.form.getlist('occupancy')[0]
    return '''Room ID: {} is currently occupied: {}\n'''.format(id, occupied)

@socketio.on('connect')
def connect():
    print('Connection aquired :D')
    socketio.emit('initialData', [('apples', True), ('pears', False)])

if __name__ == '__main__':
    socketio.run(app)
    app.debug = True
    app.run()
