from flask import Flask, request
import flask_socketio
from config import dblogin

import mysql.connector
from mysql.connector import errorcode

import uuid

app = Flask(__name__)
app.config['SECRET_KEY'] = 'asdf!'
socketio = flask_socketio.SocketIO(app)
db_cnx = mysql.connector.connect(**dblogin())

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

def update_table(isOccupied, secretId):
    global db_cnx
    cursor = db_cnx.cursor()
    query = ("USE room_occupancy")
    cursor.execute(query)

    query = ("UPDATE `rooms` "
                "SET `isOccupied` = %s "
                "WHERE `secretId` = %s")

    cursor.execute(query, (isOccupied, secretId))
    db_cnx.commit()
    cursor.close()

def query_rooms():
    global db_cnx
    cursor = db_cnx.cursor()
    query = ("USE room_occupancy")
    cursor.execute(query)

    query = ("SELECT `name`, `isOccupied` FROM `rooms`")
    cursor.execute(query)

    tuples = cursor.fetchall() # a list of tuples
    db_cnx.commit()
    cursor.close()
    return tuples

def name_from_uuid(uuid):
    global db_cnx
    cursor = db_cnx.cursor()
    query = ("USE room_occupancy")
    cursor.execute(query)

    query = ("SELECT `name` FROM `rooms` WHERE `secretId` = %s")
    cursor.execute(query, (uuid,))

    tuples = cursor.fetchall()
    db_cnx.commit()
    cursor.close()
    return tuples[0][0]

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
        return "Bad secretId format"

    if (occupied == "true"):
        update_table(True, id)
    elif (occupied == "false"):
        update_table(False, id)
    else: 
        return "Bad isOccupied status"

    room_name = name_from_uuid(id)
    # global transmission
    socketio.emit('update', [room_name, occupied])
    # Using a tuple as the second argument above causes the two
    # items to be sent as separate arguments to the handler.
    return "Success"

@socketio.on('connect')
def connect():
    # response to client
    flask_socketio.emit('initialData', query_rooms())

if __name__ == '__main__':
    socketio.run(app)

    app.debug = True
    try:
        app.run()
    finally:
        db_cnx.close()
