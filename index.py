from flask import Flask, render_template, request,json, redirect,url_for,flash,make_response,jsonify
from flask.helpers import flash
from flask_mysqldb import MySQL
from werkzeug.utils import escape

app = Flask(__name__)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '7312010'
app.config['MYSQL_DB'] = 'notas_flask'

db = MySQL(app)

@app.route('/')
def inicio():
    conexion = db.connection.cursor()
    conexion.execute("SELECT * FROM notas")
    data = conexion.fetchall()

    return render_template('index.html',data=data)


@app.route('/agregarNota', methods=["POST"])
def agregarNota():
    try:
        objNota = request.get_json()

        titulo = objNota['titulo']
        descripcion = objNota['descripcion']
        conexion = db.connection.cursor()
        estado = 1
        conexion.execute("INSERT INTO notas (titulo,descripcion,estado) VALUES (%s,%s,%s);",[titulo, descripcion,estado])
        db.connection.commit()



        conexion.execute("SELECT * FROM notas")
        data = conexion.fetchall()

        jsonObj = json.dumps(data)

        respuesta = make_response(jsonify(jsonObj),200)
        return render_template('listadoNotas.html',data=data)

    except:
        respuesta = make_response(jsonify({"message": "ERROR MYSQL"}),500)
        return respuesta

@app.route('/cambiarEstado',methods=["POST"])
def cambiarEstado():
    try:
        objEstado = request.get_json()

        idNota = objEstado['id']
        estado = objEstado['estado']
        conexion = db.connection.cursor()
        
        conexion.execute("UPDATE notas SET estado = (%s) WHERE id = %s;",[estado, idNota])
        db.connection.commit()
        conexion.execute("SELECT * FROM notas")
        data = conexion.fetchall()

        jsonObj = json.dumps(data)

        respuesta = make_response(jsonify(jsonObj),200)
        return render_template('listadoNotas.html',data=data)

    except:
        respuesta = make_response(jsonify({"message": "ERROR MYSQL"}),500)

        return respuesta

@app.route('/editarNota',methods=["POST"])
def editarNota():
    try:
        objNota = request.get_json()

        idNota = objNota['id']
        titulo = objNota['titulo']
        descripcion = objNota['descripcion']

        conexion = db.connection.cursor()
        conexion.execute("UPDATE notas SET titulo = (%s),descripcion = (%s) WHERE id = %s;",[titulo, descripcion,idNota])
        db.connection.commit()

        conexion.execute("SELECT * FROM notas")
        data = conexion.fetchall()

        jsonObj = json.dumps(data)

        respuesta = make_response(jsonify(jsonObj),200)
        return render_template('listadoNotas.html',data=data)

    except:
        respuesta = make_response(jsonify({"message": "ERROR MYSQL"}),500)
        return respuesta

@app.route('/eliminarNota',methods=["GET"])
def eliminarNota():
    try:
        idNota = request.args.get("id")
        conexion = db.connection.cursor()
        
        conexion.execute("DELETE FROM notas WHERE id = %s LIMIT 1;",[idNota,])
        db.connection.commit()
        conexion.execute("SELECT * FROM notas")
        data = conexion.fetchall()

        jsonObj = json.dumps(data)

        respuesta = make_response(jsonify(jsonObj),200)
        return render_template('listadoNotas.html',data=data)
    except:
        respuesta = make_response(jsonify({"message": "ERROR MYSQL"}),500)
        return respuesta

if __name__ == '__main__':
    app.run(port = 5000,debug=True)