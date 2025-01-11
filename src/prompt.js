export const formatPrompt = (prompt) => {
  return `
  All the files which are required to build this application should be mentioned in the specific format.
  where it should be under file tag, name tag should contain the name of the file, path tag should contain the path of the file and content tag should contain the content of the file.
  for example,
  <CodeParserFile>
    <CodeParserName>{file name}</CodeParserName>
    <CodeParserPath>{file path}</CodeParserPath>
    <CodeParserContent>
      {code in the file}
    </CodeParserContent>
  </CodeParserFile>
  for example if a file named example.js is in the root directory, then it should be mentioned as
  <CodeParserFile>
    <CodeParserName>example.js</CodeParserName>
    <CodeParserPath>example.js</CodeParserPath>
    <CodeParserContent>
      console.log('Hello World');
    </CodeParserContent>
  </CodeParserFile>
  for example if a file named example.js is in the src directory, then it should be mentioned as
  <CodeParserFile>
    <CodeParserName>example.js</CodeParserName>
    <CodeParserPath>src/example.js</CodeParserPath>
    <CodeParserContent>
      console.log('Hello World');
    </CodeParserContent>
  </CodeParserFile>

  you should provide the entire code for all the files required to build this application.

  after that you should provide your generel text information about the application in the specific format, like inside response tag.
  for example,
  <CodeParserResponse>
    This is a web application which is built using HTML, CSS and JavaScript.
    It is a simple web application which displays a welcome message.
  </CodeParserResponse>

  Also, mention the title according to you of this application in title tag, like 
  <CodeParserTitle>My Web Application</CodeParserTitle>

  Consider following things to avoid errors in application:
    1. The files should be mentioned in the specific format.
    2. Make sure you provide the files, which you have imported in other files.
    3. Make sure to use characters directlt, instead of using there codes, 
      for example,
        use single quotes instead of using &#39;.
        use < instead of using &lt;.
        use > instead of using &gt;.
        and etc.

  ${prompt}
  `
}