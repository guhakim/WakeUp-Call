import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../providers/alarm_provider.dart';
import '../providers/rewards_provider.dart';
import '../widgets/stitch_divider.dart';
import '../widgets/alarm_card.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  @override
  void initState() {
    super.initState();
    // 알람 타이머 시작
    ref.read(alarmProvider.notifier).startMonitoring(
      onAlarmFired: () => context.go('/ring'),
    );
  }

  @override
  Widget build(BuildContext context) {
    final alarms = ref.watch(alarmProvider);
    final points = ref.watch(rewardsProvider).points;
    final now    = DateTime.now();

    return Scaffold(
      backgroundColor: const Color(0xFFFDFBF4),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [

              // ── 헤더 ──
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 20),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('웨이크업 콜 ☀️',
                      style: TextStyle(fontSize: 22, fontWeight: FontWeight.w700)),
                    GestureDetector(
                      onTap: () => context.go('/rewards'),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF4A228),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: const Color(0xFF2D2D2D), width: 2),
                          boxShadow: const [BoxShadow(offset: Offset(2, 2), color: Color(0xFF2D2D2D))],
                        ),
                        child: Text('🌟 ${points}pt', style: const TextStyle(fontSize: 16)),
                      ),
                    ),
                  ],
                ),
              ),

              // ── 현재 시각 ──
              Center(
                child: Container(
                  width: 190, height: 190,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.white,
                    border: Border.all(color: const Color(0xFF2D2D2D), width: 3),
                    boxShadow: const [BoxShadow(offset: Offset(5, 5), color: Color(0xFF2D2D2D))],
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(DateFormat('HH:mm').format(now),
                        style: const TextStyle(fontSize: 46, fontWeight: FontWeight.w700)),
                      Text(DateFormat(':ss').format(now),
                        style: const TextStyle(fontSize: 18, color: Color(0xFF8C8C8C))),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 24),
              const StitchDivider(),
              const SizedBox(height: 16),

              // ── 알람 목록 ──
              Expanded(
                child: ListView.separated(
                  itemCount: alarms.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 10),
                  itemBuilder: (ctx, i) => AlarmCard(
                    alarm: alarms[i],
                    onDelete: () => ref.read(alarmProvider.notifier).remove(alarms[i].id),
                    onTest:   () => context.go('/ring'),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),

      // ── 알람 추가 FAB ──
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showAddAlarmSheet,
        backgroundColor: const Color(0xFFF4A228),
        label: const Text('+ 알람 추가', style: TextStyle(color: Color(0xFF2D2D2D))),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: const BorderSide(color: Color(0xFF2D2D2D), width: 2),
        ),
      ),
    );
  }

  void _showAddAlarmSheet() {
    TimeOfDay selected = TimeOfDay.now();
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFFFDFBF4),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        side: BorderSide(color: Color(0xFF2D2D2D), width: 2),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('알람 시간 설정', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w700)),
            const SizedBox(height: 16),
            const StitchDivider(),
            const SizedBox(height: 16),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFF4A228),
                side: const BorderSide(color: Color(0xFF2D2D2D), width: 2),
              ),
              onPressed: () async {
                final t = await showTimePicker(context: ctx, initialTime: selected);
                if (t != null && mounted) {
                  ref.read(alarmProvider.notifier).add(hour: t.hour, minute: t.minute);
                  Navigator.pop(ctx);
                }
              },
              child: const Text('시간 선택', style: TextStyle(color: Color(0xFF2D2D2D))),
            ),
          ],
        ),
      ),
    );
  }
}
