import { GeneralError } from '@feathersjs/errors'
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext, Id, Paginated } from '@feathersjs/feathers'
import webpush, { PushSubscription, VapidKeys, SendResult } from 'web-push'
import {
  NotificationId,
  NotificationData,
  Application,
} from '../../declarations'

async function triggerPushMsg(
  subscription: PushSubscription,
  data: string
): Promise<SendResult> {
  return webpush.sendNotification(subscription, data)
}

async function findNotification(
  app: Application,
  notificationId: Id
): Promise<NotificationData> {
  return app.service('notifications').get(notificationId)
}

async function findSubscription(
  app: Application,
  query: object
): Promise<Paginated<PushSubscription>> {
  return app.service('subscriptions-notifications').find({ query }) as Promise<
    Paginated<PushSubscription>
  >
}

function getVapidKeys(app: Application): VapidKeys & { subject: string } {
  const vapid = app.get('vapid')
  return {
    subject: vapid.subject,
    publicKey: vapid.publicKey,
    privateKey: vapid.privateKey,
  }
}

function setVapid(keys: VapidKeys & { subject: string }) {
  webpush.setVapidDetails(keys.subject, keys.publicKey, keys.privateKey)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (
    context: HookContext<NotificationId | NotificationData>
  ): Promise<HookContext> => {
    const { app, data } = context

    if (data) {
      try {
        setVapid(getVapidKeys(app as Application))
      } catch (error) {
        throw new GeneralError('impossible to set vapid keys')
      }
      let notification: NotificationData
      if ((data as NotificationData).title) {
        notification = data as NotificationData
      } else {
        try {
          notification = await findNotification(
            app as Application,
            (data as NotificationId).notificationId
          )
        } catch (error) {
          throw new GeneralError(
            `Can\'t get the notification '${
              (data as NotificationId).notificationId
            }'`
          )
        }
      }
      if (notification) {
        let result: Paginated<PushSubscription>
        try {
          result = await findSubscription(app as Application, {})
        } catch (error) {
          throw new GeneralError('impossible to find subscription')
        }

        for await (const subscription of result.data) {
          try {
            await triggerPushMsg(
              subscription,
              JSON.stringify({
                notification: {
                  title: notification.title,
                  body: notification.body,
                  image: '',
                  icon: '',
                  data: {
                    url: 'oui',
                  },
                },
              })
            )
          } catch (error) {
            throw new GeneralError('webpush failed to send notification')
          }
        }
      }
    }
    return context
  }
}
