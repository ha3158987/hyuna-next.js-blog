// 서버의 역할을 수행하고 싶을 때 - api를 커스텀하게 만들어서 쓰고 싶을 때 사용

export default function handler(req, res) {
  res.status(200).json({ text: 'Hello' });
}