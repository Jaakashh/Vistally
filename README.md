Vistally
Vistally is a modern visit planning and expense management web application designed to help sales teams, field staff, and business users organize client meetings, track follow-ups, and record visit-related expenses in one place.

It combines visit scheduling, visit master management, expense entry, monthly dashboard reporting, and calendar-based planning in a clean, modern interface.

Overview
Vistally is built for teams that regularly plan customer visits and need a simple system to manage visit data along with travel and meeting expenses. The application focuses on fast data entry, clear tracking, and a dashboard experience that makes daily visit operations easier to manage.

Core Modules
1. Dashboard
Month and year selection

Total visits for the selected month

Total expenses for the selected month

List of pending visits

Quick actions to add expenses and call clients

Calendar view with highlighted planned visit dates

Planned visit count shown on each booked date

2. Visit Planning
The Plan Visit module allows users to create and manage visit schedules using the following fields:

Client Name

Company Name

Mobile Number

Email ID

Date of Planning

Time

Company Location / Current Location

Visit Purpose

Visit Type

Status

Notes

3. Master Management
The application includes master setup screens for:

Visit Type Master

Visit Purpose Master

Expense Type Master

These masters help standardize dropdown values and improve reporting consistency.

4. Expense Management
Add expenses against planned visits

Categorize expenses by expense type

Store amount, date, notes, and bill image

Link expenses directly to visit records

5. Settings
Account information

User profile

Clear data option

Key Features
Modern Bootstrap-based responsive UI

Clean dashboard with KPI cards and visit summary

Floating action button for quick visit planning

Visit-wise expense tracking

Calendar-based visit visualization

Pending visit management

Master data configuration for visit and expense categories

Client communication shortcuts such as call actions

Scalable backend-ready architecture

Suggested Tech Stack
Frontend
HTML5

Bootstrap 5

Custom CSS

Vanilla JavaScript

Backend
Supabase

PostgreSQL database

Authentication

Storage for bill images

Row Level Security (RLS)

Suggested Database Structure
Main Tables
visit_types

visit_purposes

expense_types

visits

visit_expenses

This structure keeps visit planning and expense records separate while allowing one visit to have multiple expense entries.

Use Cases
Vistally is useful for:

Sales representatives

Field executives

Service engineers

Business development teams

Organizations that need visit planning with expense tracking

UI Direction
The application is designed with a latest-generation admin dashboard style using:

Modern Bootstrap theme

Clean cards and soft shadows

Sidebar navigation

Responsive layouts

Calendar and table-based planning views

User-friendly forms and modals

Future Enhancements
Possible upgrades for future versions:

Geo-location capture for visit locations

WhatsApp or email reminders

Role-based access control

Visit reports export to Excel/PDF

Approval workflow for expenses

Client history timeline

Mobile app version

Offline-first support

Project Goal
The goal of Vistally is to simplify visit scheduling and expense tracking for field-based workflows by providing a fast, modern, and practical web-based management system.
