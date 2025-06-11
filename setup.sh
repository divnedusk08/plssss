#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up HourTrackr NJHS development environment...${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${BLUE}Creating .env file...${NC}"
    cat > .env << EOL
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
EOL
    echo -e "${GREEN}Created .env file. Please update it with your Supabase credentials.${NC}"
fi

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm install

# Create development scripts
echo -e "${BLUE}Setting up development scripts...${NC}"
cat > dev.sh << EOL
#!/bin/bash
npm run dev
EOL

chmod +x dev.sh

echo -e "${GREEN}Setup complete!${NC}"
echo -e "To start development:"
echo -e "1. Update .env with your Supabase credentials"
echo -e "2. Run ${BLUE}./dev.sh${NC} to start the development server" 