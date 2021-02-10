import React from 'react';
import { useStyles } from './styles.js';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

export default function UserScores({ scores, loggedIn }) {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <h3 className={classes.title}>My top Scores</h3>
            {loggedIn ?
                <List>
                    {scores.map((item, i) =>
                        <ListItem button key={i}>
                            <p className={classes.score}>{i + 1} - </p><p className={classes.name}>{item.score}</p>
                        </ListItem>
                    )}
                </List>
                :
                <h5 className={classes.text}>Please log in to see your scores</h5>
            }
        </div>
    );
};