from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///exercises.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Exercise Model
class Exercise(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    duration = db.Column(db.Integer, nullable=False)  # Duration in minutes
    date = db.Column(db.String(20), nullable=False)  # Exercise date

# Home Page - List all exercises
@app.route('/')
def index():
    exercises = Exercise.query.all()
    return render_template('index.html', exercises=exercises)

# Add Exercise Route
@app.route('/add', methods=['POST'])
def add_exercise():
    name = request.form.get('name')
    duration = request.form.get('duration')
    date = request.form.get('date')
    
    if not name or not duration or not date:
        return redirect(url_for('index'))
    
    try:
        duration = int(duration)
    except ValueError:
        return redirect(url_for('index'))
    
    new_exercise = Exercise(name=name, duration=duration, date=date)
    db.session.add(new_exercise)
    db.session.commit()
    return redirect(url_for('index'))

# Delete Exercise Route
@app.route('/delete/<int:id>')
def delete_exercise(id):
    exercise = Exercise.query.get_or_404(id)
    db.session.delete(exercise)
    db.session.commit()
    return redirect(url_for('index'))

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
