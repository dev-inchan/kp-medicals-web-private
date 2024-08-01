export const loginApi = async (userid: string, password: string) => {
  const response = await fetch(process.env.NEXT_PUBLIC_URL + 'api/medical-wallet/users/access', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      account: userid,
      password: password,
      uid: 'uuid-mobile',
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Network response was not ok');
  }

  return result;
};
