from flask import Flask, json, render_template, request, redirect,url_for,flash,make_response,jsonify
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
    print(data)

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

        respuesta = make_response(jsonify({"message": "JSON received"}),200)

        return respuesta

    except:
        respuesta = make_response(jsonify({"message": "ERROR MYSQL"}),500)

        return respuesta
        #print(request.form['objNota'])
        # flash("Contacto AGREGRADO CORRECTAMENTE")


@app.route('/cambiarEstado',methods=["POST"])
def cambiarEstado():

    try:
        objEstado = request.get_json()

        idNota = objEstado['id']
        estado = objEstado['estado']

        print(idNota)
        print(estado)
        conexion = db.connection.cursor()
        
        conexion.execute("UPDATE notas SET estado = (%s) WHERE id = %s;",[estado, idNota])
        db.connection.commit()
        respuesta = make_response(jsonify({"message": "ESTADO RECIBIDO"}),200)

        return respuesta

    except:
        respuesta = make_response(jsonify({"message": "ERROR MYSQL"}),500)

        return respuesta
    return "hola"

@app.route('/editarNota')
def editarNota():
    return 'EDITAR NOTA'

@app.route('/eliminarNota')
def eliminarNota():
    return 'ELIMINAR NOTA'

if __name__ == '__main__':
    app.run(port = 5000,debug=True)