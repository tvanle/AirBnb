//TODO
import bcrypt from 'bcrypt';

export async function POST(req: Request, res: Response) 
{
  const body = await req.json();
    const { email,name, password } = body;
    const hashedPassword = await bcrypt.hash(password, 12);
}