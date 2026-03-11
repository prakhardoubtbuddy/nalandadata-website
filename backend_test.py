import requests
import sys
import json
from datetime import datetime
import os

class SChandAPITester:
    def __init__(self, base_url="https://ai-corpus.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}" if not endpoint.startswith('http') else endpoint
        test_headers = {'Content-Type': 'application/json'}
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=30)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json() if response.text else {}
                except:
                    response_data = {"raw_response": response.text}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    response_data = response.json() if response.text else {"error": f"Status {response.status_code}"}
                except:
                    response_data = {"error": f"Status {response.status_code}", "raw_response": response.text}

            self.test_results.append({
                "name": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": response.status_code,
                "success": success,
                "response_data": response_data
            })

            return success, response_data

        except requests.exceptions.RequestException as e:
            print(f"❌ Failed - Network Error: {str(e)}")
            self.test_results.append({
                "name": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": "Network Error",
                "success": False,
                "error": str(e)
            })
            return False, {"error": str(e)}

    def test_health_endpoint(self):
        """Test basic health check"""
        return self.run_test("Health Check", "GET", "health", 200)

    def test_admin_login(self, username="admin", password="schand2024"):
        """Test admin login with correct credentials"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "admin/login",
            200,
            data={"username": username, "password": password}
        )
        return success, response

    def test_admin_login_invalid(self):
        """Test admin login with invalid credentials"""
        return self.run_test(
            "Admin Login - Invalid Credentials",
            "POST",
            "admin/login",
            401,
            data={"username": "wrong", "password": "wrong"}
        )

    def test_stats_endpoint(self):
        """Test stats endpoint"""
        return self.run_test("Get Stats", "GET", "stats", 200)

    def test_create_lead(self):
        """Test creating a lead"""
        test_lead = {
            "full_name": f"Test User {datetime.now().strftime('%H%M%S')}",
            "work_email": f"test{datetime.now().strftime('%H%M%S')}@example.com",
            "company": "Test Company",
            "role": "ML Engineer",
            "company_type": "startup",
            "use_case": "pretraining",
            "dataset_interest": "academic-reasoning",
            "message": "Test lead from automated testing"
        }
        
        success, response = self.run_test(
            "Create Lead",
            "POST",
            "leads",
            200,
            data=test_lead
        )
        
        if success and 'id' in response:
            return success, response['id'], response
        return success, None, response

    def test_get_leads(self):
        """Test getting all leads"""
        return self.run_test("Get All Leads", "GET", "leads", 200)

    def test_delete_lead(self, lead_id):
        """Test deleting a lead"""
        if not lead_id:
            return False, {"error": "No lead ID provided"}
        return self.run_test(
            "Delete Lead",
            "DELETE",
            f"leads/{lead_id}",
            200
        )

    def test_get_files(self):
        """Test getting all files"""
        return self.run_test("Get All Files", "GET", "files", 200)

    def test_get_files_by_category(self, category="academic-reasoning"):
        """Test getting files by category"""
        return self.run_test(
            f"Get Files by Category ({category})",
            "GET",
            f"files/category/{category}",
            200
        )

    def test_file_upload_endpoint(self):
        """Test file upload endpoint with multipart/form-data"""
        url = f"{self.base_url}/files/upload"
        
        print(f"\n🔍 Testing File Upload Endpoint...")
        print(f"   URL: {url}")
        
        # Create a simple test file
        test_content = "test,data\n1,2\n3,4"
        files = {
            'file': ('test_dataset.csv', test_content, 'text/csv')
        }
        data = {
            'dataset_category': 'academic-reasoning',
            'description': 'Test upload from automated testing',
            'is_sample': 'true'
        }
        
        self.tests_run += 1
        
        try:
            response = requests.post(url, files=files, data=data, timeout=30)
            
            success = response.status_code == 200
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                except:
                    response_data = {"raw_response": response.text}
            else:
                print(f"❌ Failed - Expected 200, got {response.status_code}")
                try:
                    response_data = response.json() if response.text else {"error": f"Status {response.status_code}"}
                except:
                    response_data = {"error": f"Status {response.status_code}", "raw_response": response.text}

            self.test_results.append({
                "name": "File Upload",
                "method": "POST",
                "endpoint": "files/upload",
                "expected_status": 200,
                "actual_status": response.status_code,
                "success": success,
                "response_data": response_data
            })

            if success and 'id' in response_data:
                return success, response_data['id'], response_data
            return success, None, response_data

        except requests.exceptions.RequestException as e:
            print(f"❌ Failed - Network Error: {str(e)}")
            self.test_results.append({
                "name": "File Upload",
                "method": "POST",
                "endpoint": "files/upload", 
                "expected_status": 200,
                "actual_status": "Network Error",
                "success": False,
                "error": str(e)
            })
            return False, None, {"error": str(e)}

    def test_file_download(self, file_id):
        """Test file download"""
        if not file_id:
            return False, {"error": "No file ID provided"}
        
        success, response = self.run_test(
            "File Download",
            "GET",
            f"files/{file_id}/download",
            200
        )
        return success, response

    def test_delete_file(self, file_id):
        """Test deleting a file"""
        if not file_id:
            return False, {"error": "No file ID provided"}
        return self.run_test(
            "Delete File",
            "DELETE",
            f"files/{file_id}",
            200
        )

def main():
    print("🚀 Starting S Chand AI Infrastructure API Tests...")
    print(f"📅 Test started at: {datetime.now()}")
    
    tester = SChandAPITester()

    # Test basic connectivity
    print("\n" + "="*50)
    print("📡 CONNECTIVITY TESTS")
    print("="*50)
    
    success, _ = tester.test_health_endpoint()
    if not success:
        print("❌ Health check failed - API may be down")
        print("🛑 Stopping tests due to connectivity issues")
        return 1

    # Test authentication
    print("\n" + "="*50) 
    print("🔐 AUTHENTICATION TESTS")
    print("="*50)
    
    tester.test_admin_login()
    tester.test_admin_login_invalid()

    # Test stats
    print("\n" + "="*50)
    print("📊 STATS TESTS")  
    print("="*50)
    
    tester.test_stats_endpoint()

    # Test lead management
    print("\n" + "="*50)
    print("👤 LEAD MANAGEMENT TESTS")
    print("="*50)
    
    lead_success, lead_id, lead_data = tester.test_create_lead()
    tester.test_get_leads()
    
    if lead_id:
        tester.test_delete_lead(lead_id)

    # Test file management  
    print("\n" + "="*50)
    print("📁 FILE MANAGEMENT TESTS")
    print("="*50)
    
    tester.test_get_files()
    tester.test_get_files_by_category()
    
    # Test file upload and cleanup
    upload_success, file_id, upload_data = tester.test_file_upload_endpoint()
    
    if file_id:
        tester.test_file_download(file_id)  
        tester.test_delete_file(file_id)

    # Print summary
    print("\n" + "="*50)
    print("📋 TEST SUMMARY")
    print("="*50)
    
    print(f"🏃 Tests run: {tester.tests_run}")
    print(f"✅ Tests passed: {tester.tests_passed}")
    print(f"❌ Tests failed: {tester.tests_run - tester.tests_passed}")
    print(f"📈 Success rate: {(tester.tests_passed/tester.tests_run*100):.1f}%")

    # Print detailed results for failed tests
    failed_tests = [test for test in tester.test_results if not test['success']]
    if failed_tests:
        print(f"\n❌ FAILED TESTS ({len(failed_tests)}):")
        for test in failed_tests:
            print(f"   • {test['name']}: Expected {test['expected_status']}, got {test.get('actual_status', 'Unknown')}")
            if 'error' in test:
                print(f"     Error: {test['error']}")

    # Determine exit code
    critical_failures = []
    for test in failed_tests:
        if any(keyword in test['name'].lower() for keyword in ['health', 'login', 'create lead']):
            critical_failures.append(test['name'])
    
    if critical_failures:
        print(f"\n🚨 CRITICAL FAILURES DETECTED:")
        for failure in critical_failures:
            print(f"   • {failure}")
        return 1
    elif failed_tests:
        print(f"\n⚠️  Some non-critical tests failed but core functionality appears working")
        return 0 
    else:
        print(f"\n🎉 All tests passed!")
        return 0

if __name__ == "__main__":
    sys.exit(main())