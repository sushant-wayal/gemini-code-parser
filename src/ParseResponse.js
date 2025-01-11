export const parseResponse = async (prompt, object) => {
  const result = await object.model.generateContentStream(prompt);

  const possibleTagChar = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/".split("");

  let onGoingTag = "";
  let onGoingData = "";

  let currentTag = "";
  let onGoingCurrentTag = false;

  let name = "";
  let path = "";
  let content = "";

  const response = {
    files: []
  }

  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    for (const char of chunkText) {
      if (char === `<`) {
        currentTag = "";
        onGoingCurrentTag = true;
      } else if (char === ">" && onGoingCurrentTag) {
        onGoingCurrentTag = false;
        if (currentTag === "CodeParserFile") {
          onGoingTag = "CodeParserFile";
        } else if (currentTag === "CodeParserName") {
          onGoingTag = "CodeParserName";
        } else if (currentTag === "CodeParserPath") {
          onGoingTag = "CodeParserPath";
        } else if (currentTag === "CodeParserContent") {
          onGoingTag = "CodeParserContent";
        } else if (currentTag === "CodeParserResponse") {
          onGoingTag = "CodeParserResponse";
        } else if (currentTag == "CodeParserTitle") {
          onGoingTag = "CodeParserTitle";
        } else if (currentTag === "/CodeParserFile" || currentTag === "/CodeParserResponse" || currentTag === "/CodeParserName" || currentTag === "/CodeParserPath" || currentTag === "/CodeParserContent" || currentTag === "/CodeParserTitle") {
          onGoingTag = "";
          if (currentTag == "/CodeParserFile") {
            response.files.push({
              name,
              path,
              content
            });
          }
          else if (currentTag == "/CodeParserResponse") {
            const data = {
              response : onGoingData.trimStart('\n').trimStart(),
              end: true
            }
            response.response = data.response;
            object.emit('response', data);
            object.emit('response-end', {});
          } else if (currentTag == "/CodeParserName") {
            onGoingData = onGoingData.replace("```xml", "");
            name = onGoingData.trimStart('\n').trimStart();
          } else if (currentTag == "/CodeParserPath") {
            const data = {
              name,
              path : onGoingData.trimStart('\n').trimStart()
            };
            path = data.path;
            object.emit('file-start', data);
            object.emit('file', data);
          } else if (currentTag == "/CodeParserContent") {
            const data = {
              name,
              path,
              content : onGoingData.trimStart('\n').trimStart(),
              end: true
            };
            content = data.content;
            object.emit('file', data);
            object.emit('file-end', {});
          } else if (currentTag == "/CodeParserTitle") {
            const data = {
              title : onGoingData.split('\n')[1]
            };
            response.title = data.title;
            object.emit('title', data);
          }
          onGoingData = "";
        } else {
          onGoingData += "<" + currentTag + ">";
        }
      } else {
        if (onGoingCurrentTag) {
          currentTag += char;
          if (!possibleTagChar.includes(char)) {
            onGoingCurrentTag = false;
            onGoingData += "<" + currentTag;
          }
        } else {
          onGoingData += char;
        }
      }
      if (onGoingTag === "CodeParserContent") {
        const data = {
          name,
          path,
          content : onGoingData.trimStart('\n').trimStart()
        };
        object.emit('file', data);
      } else if (onGoingTag === "CodeParserResponse") {
        const data = {
          response : onGoingData.trimStart('\n').trimStart()
        }
        object.emit('response', data);
      }
    }
  }
  return response;
}