import { exec } from "child_process";
import db from "./db";
import { Status, Upload } from "@prisma/client";
import { mkdir } from "fs";
import path from "path";

let isTranscoding = false;

function Transcode(upload: Upload) {
  isTranscoding = true;
  //create a new promise here
  const baseOutPath = path.join(__dirname, "..", "uploads", upload.id, "360p");
  mkdir(baseOutPath, (err) => {
    const command = `ffmpeg -i ${upload.uploadUrl} -s 640x360 -c:v h264 -b:v 800k -c:a aac -b:a 128k -hls_time 6 -hls_playlist_type vod -hls_segment_filename "${baseOutPath}/360p_%03d.ts" ${baseOutPath}/360p.m3u8`;
    // -map [v480out] -map 0:a -c:v h264 -b:v:1 1400k -c:a aac -b:a:1 128k -hls_time 6 -hls_playlist_type vod -hls_segment_filename "/480p/480p_%03d.ts" 480p.m3u8 \
    // -map [v720out] -map 0:a -c:v h264 -b:v:2 2800k -c:a aac -b:a:2 192k -hls_time 6 -hls_playlist_type vod -hls_segment_filename "/720p/720p_%03d.ts" 720p.m3u8 \
    // -map [v1080out] -map 0:a -c:v h264 -b:v:3 5000k -c:a aac -b:a:3 192k -hls_time 6 -hls_playlist_type vod -hls_segment_filename "/1080p/1080p_%03d.ts" 1080p.m3u8`;

    exec(command, async (err, stdout, stderr) => {
      //Resolve it here
      console.log(stdout);
      console.log(stderr);
      if (err) {
        await new Promise((r) => setTimeout(r, 1000));
        return;
      }
      await db.upload.update({
        where: {
          id: upload.id,
        },
        data: {
          status: Status.processed,
        },
      });
      isTranscoding = false;
    });
  });
}

async function main() {
  while (true) {
    const upload = await db.upload.findFirst({
      where: {
        status: "processed",
      },
    });

    console.log({ upload, isTranscoding });
    if (!upload || isTranscoding) {
      await new Promise((r) => setTimeout(r, 1000));
      continue;
    }

    await db.upload.update({
      where: {
        id: upload.id,
      },
      data: {
        status: Status.processed,
      },
    });
    Transcode(upload);
  }
}

main();
