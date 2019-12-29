import { each } from "async";
import { Request, Response, NextFunction } from "express";
import firebase from "firebase";
import moment from "moment";

import { firebaseConfig } from "../config/firebase";

interface User {
  birthDate: Date;
  firstName: string;
  lastName: string;
}

const firebaseApp = firebase.initializeApp(firebaseConfig);

export const create = (req: Request, res: Response) => {
  const user: User = {
    birthDate: moment(req.body.birthDate, "DD/MM/YYYY").toDate(),
    firstName: req.body.firstName,
    lastName: req.body.lastName
  };

  firebaseApp
    .firestore()
    .collection("users")
    .add(user)
    .then(() => {
      res.send({ message: "El usuario a sido creado satifactoriamente" });
    })
    .catch(error => {
      console.error(error);
      res.status(400).send({ message: "Ocurrió un problema al intentar crear el usuario" });
    });
};

export const getUsers = (_: Request, res: Response, next: NextFunction) => {
  firebaseApp
    .firestore()
    .collection("users")
    .get()
    .then(response => {
      res.locals.users = response.docs;
      next();
    })
    .catch(error => {
      res
        .status(400)
        .send({ error, message: "Ocurrió un problema al intentar obtener los usuarios de la base de datos" });
    });
};

export const avg = (_: Request, res: Response, next: NextFunction) => {
  const users: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>[] = res.locals.users;
  const ages: number[] = [];
  let avg = 0;

  each(
    users,
    (user, callback) => {
      const now = moment();
      const birthDate = moment.unix(user.get("birthDate").seconds);
      const age = now.diff(birthDate, "years");
      ages.push(age);
      avg += age;
      callback();
    },
    error => {
      if (error) {
        res.status(400).send({
          error,
          message: "Ocurrió un problema al intentar calcular el promedio de las edades de los usuarios"
        });
      } else {
        avg /= ages.length;
        res.locals.ages = ages;
        res.locals.avg = avg;
        next();
      }
    }
  );
};

export const stDev = (_: Request, res: Response, next: NextFunction) => {
  const ages: number[] = res.locals.ages;
  const avg: number = res.locals.avg;
  let stDev = 0;

  each(
    ages,
    (age, callback) => {
      stDev += Math.pow(Math.abs(age - avg), 2);
      callback();
    },
    error => {
      if (error) {
        res.status(400).send({
          error,
          message: "Ocurrió un problema al intentar calcular la desviacion estandar de las edades de los usuarios"
        });
      } else {
        stDev = Math.sqrt(stDev / ages.length);
        // res.locals.avg = avg;
        res.locals.stDev = stDev.toFixed(3);
        next();
      }
    }
  );
};

export const kpi = (_: Request, res: Response) => {
  res.send({ avg: Math.round(res.locals.avg), stDev: +res.locals.stDev });
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
