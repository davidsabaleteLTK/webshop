import type { NextApiRequest, NextApiResponse } from "next";
import { ITEMS, NORMALIZED_ITEMS } from "@webshop/data";
import { RemoteItem } from "@webshop/models";
import { paginate } from "@webshop/utils";

export default (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET": {
      let items: RemoteItem[];
      const ids = req.query.ids as string;
      /**
       * Support batch by ids call
       */
      if (ids) {
        items = ids.split(",").map((id) => NORMALIZED_ITEMS[id]);
      } else {
        items = ITEMS.slice(0);
      }

      const page = parseInt(req.query.page as string);
      const size = parseInt(req.query.size as string);

      const response =
        isNaN(page) || isNaN(size)
          ? {
              content: items,
              page: 0,
              size: items.length,
              totalResults: items.length,
            }
          : paginate(items, page, size);

      res.status(200).json(response);

      console.debug(`/api/items returned`, response.content.length, "items");
      break;
    }
    default: {
      res.status(405).end();
    }
  }
};
