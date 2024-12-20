from flask import Flask
import routes
from extensions import db, security, cache
from env import APP_SECRET_KEY, SQLALCHEMY_DATABASE_URI, SECURITY_PASSWORD_SALT
from extensions.create_initial_data import create_data
import resources
from celery_worker import celery_init_app
import flask_excel as excel
from tasks import daily_reminder, monthly_report
from celery.schedules import crontab
from datetime import datetime as dt

def create_app():
    app = Flask(__name__)

    app.config['SECRET_KEY'] = APP_SECRET_KEY
    app.config['SECURITY_PASSWORD_SALT'] = SECURITY_PASSWORD_SALT
    app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI

    app.config['DEBUG'] = True
    app.config['CACHE_TYPE'] = "RedisCache"
    app.config['CACHE_DEFAULT_TIMEOUT'] = 50

    app.config['SECURITY_REGISTERABLE'] = True
    app.config['SECURITY_SEND_REGISTER_EMAIL'] = False
    app.config['SECURITY_TRACKABLE'] = True

    db.init_app(app)
    cache.init_app(app)

    with app.app_context():

        from models import User, Role
        from flask_security import SQLAlchemyUserDatastore

        user_datastore = SQLAlchemyUserDatastore(db, User, Role)
        security.init_app(app, user_datastore)        

        db.create_all()
        create_data(user_datastore)

    app.config["WTF_CSRF_CHECK_DEFAULT"] = False 
    app.config['SECURITY_CSRF_PROTECT_MECHANISMS'] = []
    app.config['SECURITY_CSRF_IGNORE_UNAUTH_ENDPOINTS'] = True

    routes.create_routes(app, user_datastore, cache)

    resources.api.init_app(app)

    return app

app = create_app()
celery_app = celery_init_app(app)
excel.init_excel(app)

@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):

    sender.add_periodic_task(
        crontab(hour='20'),daily_reminder.s(), name="Daily Login reminders"
    )
    sender.add_periodic_task(
        crontab(0, 0, day_of_month='1'),monthly_report.s(dt.now()), name="Monthly Report"
    )


if __name__=='__main__':
    app.run(debug=True, host='0.0.0.0')