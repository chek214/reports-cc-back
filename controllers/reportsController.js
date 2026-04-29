import resp from '../functions/responseHelper.js'
import { query as q } from "../database/connection.js";

const activeUsers = async (req, res) => {
    try {
        const { startDate, endDate, organizationId } = req.body

        if(!startDate || !endDate || !organizationId) {
            return resp(res, 403, req.body, 'Not enough data')
        }

        const query = `
            SELECT *
            FROM (
            SELECT 
                gu.id_user, gu.email, gu.name, gu.last_name, 
                ag.id_achievements_groups, ag.name AS group_name, 
                a.id_achievement, a.name AS achievement_name, 
                a.type, ca.score, ca.created_at
            FROM campaign c
            JOIN achievements_groups ag ON c.ID_CAMPAIGN = ag.ID_CAMPAIGN
            JOIN achievements a ON ag.id_achievements_groups = a.ID_ACHIEVEMENTS_GROUPS
            JOIN complete_achievments ca ON a.ID_ACHIEVEMENT = ca.ID_ACHIEVEMENT
            JOIN gam_users gu ON ca.ID_USER = gu.id_user
            WHERE c.id_organization = ${organizationId} and
            c.ID_ORGANIZATION = ${organizationId} AND
            ca.created_at >= '${startDate}' AND
            ca.created_at <= ${endDate === '' ? 'current_date' : `'${endDate}'`}

            UNION ALL

            SELECT 
                gu.id_user, gu.email, gu.name, gu.last_name, 
                ag.id_achievements_groups, ag.name AS group_name, 
                a.id_achievement, a.name AS achievement_name, 
                a.type, ca.score, ca.created_at
            FROM campaign c
            JOIN achievements_groups ag ON c.ID_CAMPAIGN = ag.ID_CAMPAIGN
            JOIN individual_achievements a ON ag.id_achievements_groups = a.ID_ACHIEVEMENTS_GROUPS
            JOIN complete_achievments ca ON a.ID_ACHIEVEMENT = ca.ID_ACHIEVEMENT
            JOIN gam_users gu ON ca.ID_USER = gu.id_user
            WHERE c.id_organization = ${organizationId}  and
            c.ID_ORGANIZATION = ${organizationId} AND
            ca.created_at >= '${startDate}' AND
            ca.created_at <= ${endDate === '' ? 'current_date' : `'${endDate}'`}
            ) AS resultado
            ORDER BY id_user, created_at;`

        const qres = await q(query)

        return resp(res, 200, {qres}, 'Success')

    } catch(error){
        console.log(error.stack)
        return resp(res, 500, null, 'Error')
    }
}

const newUsers = async (req, res) => {
    try {
        const { startDate, endDate, organizationId } = req.body

        if(!startDate || !endDate || !organizationId) {
            return resp(res, 403, req.body, 'Not enough data')
        }

        const query = `SELECT 
            gu.ID_USER,
            gu.NAME,
            gu.LAST_NAME,
            gu.EMAIL,
            gu.PHONE_NUMBER,
            gu.BIRTHDAY,
            gu.CREATED_AT,
            gu.USERNAME,
            gu.TUTORIAL,
            gu.TERMS,
            gu.RADAR,
            gu.PROFILE
        FROM GAMIFICACION_MVP_DB.GAMIFICACION.GAM_USERS gu
        INNER JOIN GAMIFICACION_MVP_DB.GAMIFICACION.USER_ORGANIZATIONS uo
            ON gu.ID_USER = uo.ID_USER
        WHERE (gu.CREATED_AT >= '${startDate}' AND gu.CREATED_AT <= ${endDate === '' ? 'current_date' : `'${endDate}'`})
            AND uo.ID_ORGANIZATION = '${organizationId}'
        ORDER BY gu.CREATED_AT;`

        const qres = await q(query)

        return resp(res, 200, {qres}, 'Success')

    } catch(error){
        console.log(error.stack)
        return resp(res, 500, null, 'Error')
    }
}

export { activeUsers, newUsers }