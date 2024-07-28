import openai
import requests
import os


def check_openai_api_credits(api_key):
    try:
        # Set the API key
        openai.api_key = api_key

        # Get current usage data
        response = requests.get(
            "https://api.openai.com/v1/usage",
            headers={
                "Authorization": f"Bearer {api_key}",
            },
        )

        if response.status_code == 200:
            usage_data = response.json()
            # You can customize this part based on the exact data structure and fields you want to check
            total_granted = usage_data["total_granted"]
            total_used = usage_data["total_used"]
            remaining_credits = total_granted - total_used

            print(f"Total Granted: {total_granted}")
            print(f"Total Used: {total_used}")
            print(f"Remaining Credits: {remaining_credits}")

            if remaining_credits > 0:
                return True
            else:
                return False
        else:
            print(
                f"Failed to retrieve usage data: {response.status_code} {response.text}"
            )
            return False
    except Exception as e:
        print(f"An error occurred: {e}")
        return False


# Example usage
api_key = os.getenv("OPENAI_API_KEY")
has_credits = check_openai_api_credits(api_key)
if has_credits:
    print("API key has credits available.")
else:
    print("API key does not have credits available.")
