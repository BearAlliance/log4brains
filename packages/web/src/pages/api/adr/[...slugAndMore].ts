import { Log4brainsError } from "@log4brains/core";
import { NextApiRequest, NextApiResponse } from "next";
import { getLog4brainsInstance, logger } from "../../../lib";
import { toAdr } from "../../../types";

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (!req.query.slugAndMore || !Array.isArray(req.query.slugAndMore)) {
    res.status(404).send("Not Found");
    return;
  }
  const uri = [...req.query.slugAndMore].join("/");
  const l4bInstance = getLog4brainsInstance();

  // POST /adr/:slug/_open-in-editor
  if (req.method === "POST" && uri.endsWith("/_open-in-editor")) {
    const slug = uri.replace(/\/_open-in-editor$/, "");
    try {
      await l4bInstance.openAdrInEditor(slug, () => {
        logger.warn("We were not able to detect your preferred editor :(");
        logger.warn(
          "You can define it by setting your $VISUAL or $EDITOR environment variable in ~/.zshenv or ~/.bashrc"
        );
      });
      res.status(200).send("");
      return;
    } catch (e) {
      if (
        e instanceof Log4brainsError &&
        e.name === "This ADR does not exist"
      ) {
        res.status(404).send("Not Found");
        return;
      }
      throw e;
    }
  }

  // GET /adr/:slug
  if (req.method === "GET") {
    const adr = await l4bInstance.getAdrBySlug(uri);
    if (adr) {
      res.status(200).json(toAdr(adr));
      return;
    }
  }

  res.status(404).send("Not Found");
};
