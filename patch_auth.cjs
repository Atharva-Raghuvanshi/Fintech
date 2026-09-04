const fs = require('fs');
let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf-8');

// Provide a default mock user
const mockUser = `const MOCK_USER = { id: 'mock-user-123', email: 'demo@example.com' } as User;`;

if (!code.includes('MOCK_USER')) {
  code = code.replace(
    /const \[user, setUser\] = useState<User \| null>\(null\);/, 
    `${mockUser}\n  const [user, setUser] = useState<User | null>(MOCK_USER);`
  );
  // Also make sure to set the user to mock if auth state changes to null
  code = code.replace(/setUser\(session\?.user \?\? null\);/g, 'setUser(session?.user ?? MOCK_USER);');
  
  fs.writeFileSync('src/contexts/AuthContext.tsx', code);
}
