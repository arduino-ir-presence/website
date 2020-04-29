from flask import Flask, request
from flask_socketio import SocketIO
from config import dblogin

import mysql.connector
from mysql.connector import errorcode

import uuid

app = Flask(__name__)
app.config['SECRET_KEY'] = 'asdf!'
socketio = SocketIO(app)
db_cnx = None

def try_db_login():
    try:
      global db_cnx
      db_cnx = mysql.connector.connect(**dblogin())
      return "Successful"

    except mysql.connector.Error as err:
      if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
        return "Something is wrong with your username or password"
      elif err.errno == errorcode.ER_BAD_DB_ERROR:
        return "Database does not exist"
      else:
        return str(err)

def update_table(data_entry):
    cursor = db_cnx.cursor()
    query = ("USE room_occupancy")
    cursor.execute(query)

    query = ("UPDATE `rooms`"
                "SET `isOccupied` = %s"
                "WHERE `secretId` = %s")

    cursor.execute(query, data_entry)
    db_cnx.commit()
    cursor.close()

def query_rooms():
    cursor = db_cnx.cursor()
    query = ("USE room_occupancy")
    cursor.execute(query)

    query = ("SELECT `name`, `isOccupied` FROM `rooms`")
    cursor.execute(query)

    tuples = cursor.fetchall()
    db_cnx.commit()
    cursor.close()
    return tuples

#https://stackoverflow.com/questions/19989481/how-to-determine-if-a-string-is-a-valid-v4-uuid
def is_valid_uuid(val):
    try:
        uuid.UUID(str(val))
        return True
    except ValueError:
        return False

@app.route('/')
def hello_world():
    return app.send_static_file("index.html")

@app.route('/updateRoomStatus', methods=['POST'])
def upload_data():
    id = request.form.getlist('secretId')[0]
    occupied = request.form.getlist('isOccupied')[0]
    if (not is_valid_uuid(id)):
        return
    if (occupied != "true" and occupied != "false"):
        return
    update_table((occupied, id))
    socketio.emit('update', (id, occupied))

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
