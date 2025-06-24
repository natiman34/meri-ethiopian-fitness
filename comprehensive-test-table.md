# Comprehensive Test Table - Meri Ethiopian Fitness Application

## Test Methodology
This test table was created through systematic analysis of:
- Application architecture and component structure
- Database schema and relationships
- Authentication and authorization flows
- Business logic and service layer functionality
- User interface components and interactions
- Security implementations and RLS policies

## Test Categories

### 1. AUTHENTICATION & USER MANAGEMENT

| Test Case ID | Test Case Description | Expected Outcome | Test Data Requirements | Step-by-Step Procedure |
|--------------|----------------------|------------------|----------------------|----------------------|
| AUTH-001 | User Registration with Valid Data | User account created successfully, profile entry in database, confirmation email sent | Valid email, password (8+ chars), full name | 1. Navigate to /register<br>2. Enter valid email, password, full name<br>3. Submit form<br>4. Verify success message<br>5. Check user_profiles table<br>6. Verify email in Inbucket (local dev) |
| AUTH-002 | User Registration with Duplicate Email | Error message displayed, no duplicate account created | Existing user email, valid password, full name | 1. Navigate to /register<br>2. Enter existing email<br>3. Submit form<br>4. Verify error message "User already registered"<br>5. Confirm no duplicate in database |
| AUTH-003 | User Login with Valid Credentials | User logged in, redirected to profile/dashboard, session established | Valid email/password combination | 1. Navigate to /login<br>2. Enter valid credentials<br>3. Submit form<br>4. Verify redirect to profile<br>5. Check authentication state |
| AUTH-004 | User Login with Invalid Credentials | Error message displayed, no session created | Invalid email/password combination | 1. Navigate to /login<br>2. Enter invalid credentials<br>3. Submit form<br>4. Verify error message<br>5. Confirm no session established |
| AUTH-005 | Password Reset - OTP Flow | OTP sent to email, verification successful, password updated | Valid registered email | 1. Navigate to /reset-password<br>2. Enter registered email<br>3. Check Inbucket for OTP<br>4. Navigate to /verify-reset-otp<br>5. Enter OTP<br>6. Set new password<br>7. Verify login with new password |
| AUTH-006 | Password Reset - Invalid OTP | Error message displayed, password not changed | Valid email, invalid 6-digit OTP | 1. Start password reset flow<br>2. Enter invalid OTP<br>3. Verify error message<br>4. Confirm password unchanged |
| AUTH-007 | User Logout | Session terminated, redirected to home page | Authenticated user session | 1. Login as user<br>2. Click logout button<br>3. Verify redirect to home<br>4. Confirm session cleared<br>5. Verify protected routes inaccessible |

### 2. USER PROFILE MANAGEMENT

| Test Case ID | Test Case Description | Expected Outcome | Test Data Requirements | Step-by-Step Procedure |
|--------------|----------------------|------------------|----------------------|----------------------|
| PROF-001 | View User Profile | Profile information displayed correctly | Authenticated user with profile data | 1. Login as user<br>2. Navigate to /profile<br>3. Verify personal info displayed<br>4. Check BMI data if available<br>5. Verify activity calendar visible |
| PROF-002 | Edit Personal Information | Profile updated successfully in database | Valid name, height, weight, fitness goal | 1. Navigate to profile<br>2. Click edit personal info<br>3. Update fields<br>4. Save changes<br>5. Verify database update<br>6. Confirm UI reflects changes |
| PROF-003 | BMI Data Persistence | BMI calculation saved to user profile | Height, weight values for calculation | 1. Navigate to /bmi<br>2. Enter height/weight<br>3. Calculate BMI<br>4. Verify save success message<br>5. Check profile page for BMI data<br>6. Confirm database entry |
| PROF-004 | Activity Calendar Interaction | Activity days can be toggled and saved | User with activity tracking enabled | 1. Navigate to profile activity section<br>2. Click calendar days<br>3. Verify visual toggle<br>4. Save activity progress<br>5. Refresh page and verify persistence |

### 3. BMI CALCULATOR

| Test Case ID | Test Case Description | Expected Outcome | Test Data Requirements | Step-by-Step Procedure |
|--------------|----------------------|------------------|----------------------|----------------------|
| BMI-001 | BMI Calculation - Metric Units | Correct BMI calculated and categorized | Height: 170cm, Weight: 70kg | 1. Navigate to /bmi<br>2. Select metric units<br>3. Enter height: 170, weight: 70<br>4. Calculate<br>5. Verify BMI: 24.22, Category: Normal |
| BMI-002 | BMI Calculation - Imperial Units | Correct BMI calculated with unit conversion | Height: 67in, Weight: 154lbs | 1. Navigate to /bmi<br>2. Select imperial units<br>3. Enter height: 67, weight: 154<br>4. Calculate<br>5. Verify correct BMI calculation |
| BMI-003 | BMI Calculation - Invalid Input | Error message for invalid/negative values | Height: -10, Weight: 0 | 1. Navigate to /bmi<br>2. Enter invalid values<br>3. Attempt calculation<br>4. Verify error message displayed<br>5. Confirm no calculation performed |
| BMI-004 | BMI Save to Profile (Authenticated) | BMI data saved to user profile | Authenticated user, valid BMI calculation | 1. Login as user<br>2. Calculate BMI<br>3. Verify save success message<br>4. Check profile for BMI data<br>5. Confirm database persistence |
| BMI-005 | BMI Calculation (Unauthenticated) | BMI calculated but not saved, login prompt | Valid height/weight, no authentication | 1. Ensure logged out<br>2. Navigate to /bmi<br>3. Calculate BMI<br>4. Verify calculation shown<br>5. Confirm login prompt for saving |

### 4. FITNESS PLANS

| Test Case ID | Test Case Description | Expected Outcome | Test Data Requirements | Step-by-Step Procedure |
|--------------|----------------------|------------------|----------------------|----------------------|
| FIT-001 | View Fitness Plans List | All published fitness plans displayed | Database with fitness plans | 1. Navigate to /services<br>2. Go to fitness plans section<br>3. Verify plans listed<br>4. Check plan cards show title, description, category<br>5. Verify only published plans visible |
| FIT-002 | View Fitness Plan Details | Complete plan details displayed | Specific fitness plan ID | 1. Click on fitness plan<br>2. Navigate to detail page<br>3. Verify plan information<br>4. Check exercise schedule<br>5. Verify equipment requirements |
| FIT-003 | Filter Fitness Plans by Category | Plans filtered correctly by category | Plans in multiple categories | 1. Navigate to fitness plans<br>2. Select category filter<br>3. Verify only matching plans shown<br>4. Test multiple categories<br>5. Clear filters and verify all plans return |
| FIT-004 | Filter Fitness Plans by Level | Plans filtered by difficulty level | Plans with different levels | 1. Navigate to fitness plans<br>2. Select level filter (beginner/intermediate/advanced)<br>3. Verify correct filtering<br>4. Test all levels<br>5. Verify filter combinations work |

### 5. NUTRITION PLANS

| Test Case ID | Test Case Description | Expected Outcome | Test Data Requirements | Step-by-Step Procedure |
|--------------|----------------------|------------------|----------------------|----------------------|
| NUT-001 | View Ethiopian Nutrition Plans | Ethiopian meal plans displayed with cultural context | Ethiopian nutrition data | 1. Navigate to nutrition plans<br>2. Verify Ethiopian plans visible<br>3. Check weight gain/loss plans<br>4. Verify traditional foods listed<br>5. Confirm caloric information displayed |
| NUT-002 | View Nutrition Plan Details | Complete nutrition plan with meals and tips | Specific nutrition plan ID | 1. Click nutrition plan<br>2. Navigate to detail page<br>3. Verify meal breakdown<br>4. Check nutritional information<br>5. Verify tips and guidelines |
| NUT-003 | Filter Nutrition Plans by Goal | Plans filtered by nutrition goal | Plans for different goals (weight loss/gain) | 1. Navigate to nutrition plans<br>2. Select goal filter<br>3. Verify appropriate plans shown<br>4. Test weight loss filter<br>5. Test weight gain filter |

### 6. CONTACT & FEEDBACK

| Test Case ID | Test Case Description | Expected Outcome | Test Data Requirements | Step-by-Step Procedure |
|--------------|----------------------|------------------|----------------------|----------------------|
| CONT-001 | Submit Contact Form (Authenticated) | Message submitted successfully, saved to database | Authenticated user, valid form data | 1. Login as user<br>2. Navigate to /contact<br>3. Fill form fields<br>4. Submit message<br>5. Verify success confirmation<br>6. Check feedback table in database |
| CONT-002 | Submit Contact Form (Unauthenticated) | Custom error message about login requirement | Valid form data, no authentication | 1. Ensure logged out<br>2. Navigate to /contact<br>3. Fill and submit form<br>4. Verify error: "First register or login in order to send feedback"<br>5. Confirm no database entry |
| CONT-003 | Contact Form Validation | Form validation prevents submission with invalid data | Invalid email, empty required fields | 1. Navigate to /contact<br>2. Submit with empty fields<br>3. Verify validation messages<br>4. Enter invalid email<br>5. Verify email validation |

### 7. ADMIN DASHBOARD

| Test Case ID | Test Case Description | Expected Outcome | Test Data Requirements | Step-by-Step Procedure |
|--------------|----------------------|------------------|----------------------|----------------------|
| ADM-001 | Admin Login and Dashboard Access | Admin can access dashboard, regular users cannot | Admin user account (admin_super role) | 1. Login as admin user<br>2. Navigate to /admin<br>3. Verify dashboard loads<br>4. Check admin navigation visible<br>5. Verify admin-only features accessible |
| ADM-002 | Non-Admin Dashboard Access Denied | Access denied for non-admin users | Regular user account | 1. Login as regular user<br>2. Attempt to navigate to /admin<br>3. Verify access denied/redirect<br>4. Confirm admin features not visible |
| ADM-003 | User Management - View Users | All users displayed in admin panel | Multiple user accounts in database | 1. Login as admin<br>2. Navigate to admin users section<br>3. Verify user list displayed<br>4. Check user information shown<br>5. Verify pagination if applicable |
| ADM-004 | User Management - Edit User | User information updated successfully | Admin account, target user to edit | 1. Access admin users section<br>2. Select user to edit<br>3. Modify user information<br>4. Save changes<br>5. Verify database update<br>6. Confirm UI reflects changes |
| ADM-005 | Create Fitness Plan | New fitness plan created and saved | Admin account, valid plan data | 1. Login as admin<br>2. Navigate to fitness admin<br>3. Create new plan<br>4. Fill all required fields<br>5. Save plan<br>6. Verify in database and frontend |
| ADM-006 | Create Nutrition Plan | New nutrition plan created and saved | Admin account, valid nutrition data | 1. Login as admin<br>2. Navigate to nutrition admin<br>3. Create new plan<br>4. Add meals and nutritional info<br>5. Save plan<br>6. Verify plan appears in listings |

### 8. SECURITY & ACCESS CONTROL

| Test Case ID | Test Case Description | Expected Outcome | Test Data Requirements | Step-by-Step Procedure |
|--------------|----------------------|------------------|----------------------|----------------------|
| SEC-001 | Row Level Security - User Profiles | Users can only access their own profile data | Multiple user accounts | 1. Login as User A<br>2. Attempt to access User B's profile data<br>3. Verify access denied<br>4. Confirm only own data accessible<br>5. Test with direct API calls |
| SEC-002 | Protected Route Access | Unauthenticated users redirected from protected routes | No authentication | 1. Ensure logged out<br>2. Navigate to /profile<br>3. Verify redirect to login<br>4. Test other protected routes<br>5. Confirm consistent behavior |
| SEC-003 | Admin Route Protection | Only admin users can access admin routes | Regular user and admin accounts | 1. Login as regular user<br>2. Attempt /admin access<br>3. Verify access denied<br>4. Login as admin<br>5. Verify admin access granted |
| SEC-004 | Password Security | Passwords properly hashed and validated | User account with known password | 1. Create user account<br>2. Check database for password hash<br>3. Verify plain text not stored<br>4. Test login with correct password<br>5. Test login with incorrect password |

### 9. ERROR HANDLING & EDGE CASES

| Test Case ID | Test Case Description | Expected Outcome | Test Data Requirements | Step-by-Step Procedure |
|--------------|----------------------|------------------|----------------------|----------------------|
| ERR-001 | Database Connection Error | Graceful error handling, fallback to local data | Simulated database outage | 1. Simulate database unavailability<br>2. Navigate to fitness/nutrition plans<br>3. Verify fallback to local data<br>4. Check error logging<br>5. Verify user experience maintained |
| ERR-002 | Invalid Route Access | 404 page displayed for non-existent routes | Non-existent URL path | 1. Navigate to /invalid-route<br>2. Verify 404 page displayed<br>3. Check navigation options available<br>4. Verify error boundary functioning |
| ERR-003 | Form Submission Errors | Appropriate error messages for failed submissions | Invalid form data scenarios | 1. Submit forms with network issues<br>2. Submit with invalid data<br>3. Verify error messages displayed<br>4. Check form state preservation<br>5. Verify retry functionality |

### 10. PERFORMANCE & USABILITY

| Test Case ID | Test Case Description | Expected Outcome | Test Data Requirements | Step-by-Step Procedure |
|--------------|----------------------|------------------|----------------------|----------------------|
| PERF-001 | Page Load Performance | Pages load within acceptable time limits | Various page types | 1. Navigate to different pages<br>2. Measure load times<br>3. Verify under 3 seconds<br>4. Test with slow network<br>5. Check loading indicators |
| PERF-002 | Mobile Responsiveness | Application functions properly on mobile devices | Mobile device or browser dev tools | 1. Open app on mobile/resize browser<br>2. Test navigation functionality<br>3. Verify forms usable<br>4. Check touch interactions<br>5. Verify responsive design |
| USAB-001 | Navigation Consistency | Navigation works consistently across all pages | Full application access | 1. Navigate through all main sections<br>2. Verify navigation bar present<br>3. Check breadcrumbs where applicable<br>4. Test back button functionality<br>5. Verify menu responsiveness |
| USAB-002 | Form Usability | Forms are intuitive and provide clear feedback | Various forms in application | 1. Test all forms in application<br>2. Verify field labels clear<br>3. Check validation messages helpful<br>4. Test tab navigation<br>5. Verify submit/cancel functionality |

## Test Environment Requirements

### Local Development Setup
- Supabase local instance running on http://127.0.0.1:54321
- Inbucket email server on http://127.0.0.1:54324
- React development server on http://localhost:5173
- Database migrations applied
- Test user accounts created

### Test Data Requirements
- Admin user account (admin_super role)
- Regular user accounts with various profile data
- Sample fitness and nutrition plans
- Ethiopian nutrition data populated
- Feedback/contact form test data

### Browser Testing
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Test Execution Notes

1. **Database State**: Ensure clean database state before critical tests
2. **Authentication**: Test both authenticated and unauthenticated scenarios
3. **Error Logging**: Monitor console for errors during testing
4. **Performance**: Use browser dev tools to monitor network and performance
5. **Security**: Verify RLS policies prevent unauthorized data access
6. **Cross-browser**: Test critical flows across different browsers
7. **Mobile**: Verify mobile responsiveness and touch interactions

## Success Criteria

- All authentication flows work securely
- User data is properly protected by RLS policies
- Admin functions are restricted to authorized users
- Forms provide appropriate validation and feedback
- Application handles errors gracefully
- Performance meets acceptable standards
- Mobile experience is fully functional
- Ethiopian nutrition data is properly integrated
- BMI calculator functions accurately
- Contact/feedback system works reliably
