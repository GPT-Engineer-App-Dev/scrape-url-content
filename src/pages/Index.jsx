import { useState } from "react";
import { Container, Text, VStack, Input, Button, Box, Spinner } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

const Index = () => {
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleScrape = async () => {
    setLoading(true);
    setError("");
    setContent("");

    try {
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, "text/html");

      const title = doc.querySelector("#firstHeading")?.innerText || "No title found";
      const paragraphs = Array.from(doc.querySelectorAll("#mw-content-text p")).map(p => p.innerText).join("\n\n");

      setContent({ title, paragraphs });
    } catch (err) {
      setError("Failed to fetch content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4} width="100%">
        <Text fontSize="2xl">URL Content Scraper</Text>
        <Input
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          size="lg"
        />
        <Button
          leftIcon={<FaSearch />}
          colorScheme="teal"
          size="lg"
          onClick={handleScrape}
          isDisabled={!url}
        >
          Scrape Content
        </Button>
        {loading && <Spinner size="xl" />}
        {error && <Text color="red.500">{error}</Text>}
        {content && (
          <Box p={4} borderWidth="1px" borderRadius="lg" width="100%" overflow="auto" maxHeight="400px">
            <Text fontSize="xl" fontWeight="bold">{content.title}</Text>
            <Text whiteSpace="pre-wrap">{content.paragraphs}</Text>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default Index;