import { Request, Response } from "express";
import firebase from "firebase";
import moment from "moment";

import { firebaseConfig } from "../config/firebase";

const firebaseApp = firebase.initializeApp(firebaseConfig);

export const create = (req: Request, res: Response) => {
  res.send({ message: "Create User" });
};

export const kpi = (req: Request, res: Response) => {
  res.send({ message: "Read User" });
};

export const list = (_: Request, res: Response) => {
  firebaseApp
    .firestore()
    .collection("users")
    .get()
    .then(response => {
      res.send(
        response.docs.map(x => {
          const now = moment();
          const birthDate = moment.unix(x.get("birthDate").seconds);

          return {
            _id: x.id,
            age: now.diff(birthDate, "years"),
            birthDate: birthDate.toDate(),
            firstName: x.get("firstName"),
            lastName: x.get("lastName")
          };
        })
      );
    })
    .catch(error => {
      res.status(400).send({ error, message: "Ocurrió un problema al intentar obtener la lista de usuarios" });
    });
};
