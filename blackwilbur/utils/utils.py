import requests

def send_sms(otp, numbers):
    url = "https://www.fast2sms.com/dev/bulkV2"
    
    querystring = {
        "authorization": "xG2Wf8QtVUo9TuzvzvP6mzHH6xYkwLc4TYDCMnCG9cVhJcRG28Fpo8DIwcls",  # Replace with your actual API key
        "variables_values": otp,
        "route": "otp",
        "numbers": ",".join(numbers)  # Convert list of numbers to a comma-separated string
    }
    
    headers = {
        'cache-control': "no-cache"
    }

    print("Sending SMS with the following parameters:")
    print(f"OTP: {otp}")
    print(f"Numbers: {numbers}")

    response = requests.get(url, headers=headers, params=querystring)  # Using GET method as specified
    
    print(f"Response Status Code: {response.status_code}")  # Log the status code of the response
    
    if response.ok:
        print("SMS sent successfully!")
        return response.json()  # Return the JSON response from the API
    else:
        print("Failed to send SMS.")
        print(f"Error Response: {response.text}")  # Log the error response text
        return {"return": False, "message": "Failed to send SMS."}  # Handle error case
