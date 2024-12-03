from extensions import db, security
from flask_security import UserMixin, RoleMixin
from flask_security.models import fsqla_v3 as fsq
from env import VISIBILITY_TYPES, REQUEST_STATUS
from datetime import datetime as dt
from flask import jsonify

fsq.FsModels.set_db_info(db)

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)
    name = db.Column(db.String, nullable=False)
    active = db.Column(db.Boolean)
    flagged = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=dt.now())
    updated_at = db.Column(db.DateTime, nullable=False, default=dt.now(), onupdate=dt.now())
    roles = db.relationship('Role', secondary = 'user_roles', backref='users')
    campaigns = db.relationship('Campaign', backref='user', cascade='all, delete-orphan')

   
    sponsor_data = db.relationship('SponsorData', uselist=False, backref='user', cascade='all, delete-orphan')
    influencer_data = db.relationship('InfluencerData', uselist=False, backref='user', cascade='all, delete-orphan')

    
    fs_uniquifier = db.Column(db.String, nullable=False)
    last_login_at = db.Column(db.DateTime, default=dt.now(), onupdate=dt.now())
    current_login_at = db.Column(db.DateTime, default=dt.now(), onupdate=dt.now())
    current_login_ip = db.Column(db.String, default="0.0.0.0")
    login_count = db.Column(db.Integer, default=0)

    def __init__(self, email, password, name, active=None, sponsor_data=None, influencer_data=None, fs_uniquifier=None, roles=None):
        self.name = name
        self.active=active
        self.fs_uniquifier = fs_uniquifier
        self.roles = roles
        self.email=email
        self.password = password
         
        if roles and roles[0].name == 'sponsor':
            self.sponsor_data = sponsor_data or SponsorData(company_name="", industry="", budget=0, user=self)
        elif roles and roles[0].name == 'influencer':
            self.influencer_data = influencer_data or InfluencerData(category="", niche="", followers=0, user=self)

    def to_dict(self):
        return {
            'id' : self.id,
            'name': self.name,
            'email':self.email,
            'role': self.roles[0].name,
            'active':self.active,
            'flagged': self.flagged,
            'influencer_data': self.influencer_data.to_dict() if self.influencer_data else None,
            'sponsor_data': self.sponsor_data.to_dict() if self.sponsor_data else None,
            'campaigns': len(self.campaigns)
        }

        

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)
    description = db.Column(db.String)

class UserRoles(db.Model):
    __tablename__ = 'user_roles'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))

class Campaign(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.Text)
    budget = db.Column(db.Float)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    visibility = db.Column(db.Enum(*VISIBILITY_TYPES, name='visibility_types'), default='private', nullable=False)
    goals =  db.Column(db.Text)
    flagged = db.Column(db.Boolean, default=False)
    ad_requests = db.relationship('AdRequest', backref='campaign', cascade='all, delete-orphan')
    created_at = db.Column(db.DateTime, nullable=False, default=dt.now())
    updated_at = db.Column(db.DateTime, nullable=False, default=dt.now(), onupdate=dt.now())

    def to_dict(self):
        return {
            'id' : self.id,
            'user_id' : self.user_id,
            'name': self.name,
            'description': self.description,
            'start_date': str(self.start_date),
            'end_date': str(self.end_date),
            'budget': self.budget,
            'visibility': self.visibility,
            'goals': self.goals,
            'flagged': self.flagged,
        }

class AdRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    campaign_id  = db.Column(db.Integer, db.ForeignKey('campaign.id'), nullable=False)
    user_id  = db.Column(db.Integer, db.ForeignKey('user.id')) 
    messages = db.Column(db.String)
    requirements = db.Column(db.String)
    payment_amount = db.Column(db.Float)
    revised_payment_amount = db.Column(db.Float)  
    negotiation_notes = db.Column(db.Text, default="") 
    status= db.Column(db.Enum(*REQUEST_STATUS, name='request_status'), default='pending', nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=dt.now())
    updated_at = db.Column(db.DateTime, nullable=False, default=dt.now(), onupdate=dt.now())
    
    def to_dict(self):
        return {
            'id': self.id,
            'campaign_id': self.campaign_id,
            'user_id': self.user_id,
            'messages': self.messages,
             'payment_amount': self.payment_amount,
            'revised_payment_amount': self.revised_payment_amount,
            'negotiation_notes': self.negotiation_notes,
            'requirements': self.requirements,
            'status': self.status
        }

class SponsorData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, unique=True)
    company_name = db.Column(db.String, nullable=False)
    industry = db.Column(db.String)
    budget = db.Column(db.Float)

    def to_dict(self):
        return {
            'company_name': self.company_name,
            'industry': self.industry,
            'budget': self.budget
        }

class InfluencerData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, unique=True)
    category = db.Column(db.String)
    niche = db.Column(db.String)
    followers = db.Column(db.Float)

    def to_dict(self):
        return {
            'category': self.category,
            'niche': self.niche,
            'followers': self.followers
        }