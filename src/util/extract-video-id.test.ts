import { extractVideoID } from "./extract-video-id";

interface TestTable {
  name: string;
  url: string;
  expectedVideoID: string | undefined;
}

describe("extractVideoID", () => {
  const table: TestTable[] = [
    {
      name: "should extract valid videoID for valid youtube URL",
      url: "https://www.youtube.com/watch?v=1pGS091fMD8",
      expectedVideoID: "1pGS091fMD8",
    },
    {
      name: "should extract videoID even though it is not a YouTube URL but has valid v parameter",
      url: "https://www.google.com/watch?v=1pGS091fMD8",
      expectedVideoID: "1pGS091fMD8",
    },
    {
      name: "should return undefined if empty url",
      url: "",
      expectedVideoID: undefined,
    },
    {
      name: "should return undefined if it is not a YouTube URL",
      url: "https://www.google.com",
      expectedVideoID: undefined,
    },
  ];

  test.each(table)("$name", ({ url, expectedVideoID }) => {
    const videoID = extractVideoID(url);
    expect(videoID).toEqual(expectedVideoID);
  });
});
