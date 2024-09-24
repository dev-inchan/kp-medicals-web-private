export const loginApi = async (userid: string, password: string) => {
  try {
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
  } catch (error) {
    console.error('login error', error);
  }
};

export const autoLogin = async (access_token: string | null) => {
  try {
    if (!access_token) {
      return;
    }
    const uid = process.env.NEXT_PUBLIC_UID;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}api/medical-wallet/users/access/auto?access_token=${access_token}&uid=${uid}`,
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Network response was not ok');
    }
    return result;
  } catch (error) {
    console.error('auto login error', error);
  }
};
